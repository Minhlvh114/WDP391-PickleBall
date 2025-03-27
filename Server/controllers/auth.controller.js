const User = require("../models/user.model.js");
const bcryptjs = require("bcryptjs");
const generateVerificationCode = require("../utils/generateVerificationCode.js");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie.js");
const generateForgotPassword = require("../utils/generateForgotPassword.js");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendForgotPasswordEmail,
  sendResetSuccessEmail,
} = require("../mailtrap/email.js");
const sendMail = require("../mailtrap/nodemailer")
const crypto = require("crypto");
const { log } = require("console");

const register = async (req, res) => {
  const { email, password, name, phone } = req.body;
  try {
    if (!email || !password || !name || !phone) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      const userAlreadyExists = await User.findOne({ phone });
      if (userAlreadyExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationCode = generateVerificationCode();
    const verificationTokenExpireAt = Date.now() + 20 * 60 * 60 * 1000;
    console.log(verificationCode)
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      username: email,
      phone,
      verificationToken: verificationCode,
      verificationTokenExpireAt: verificationTokenExpireAt,
    });
    generateTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationCode);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user account is active
    if (user.status === 'inactive') {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị hạn chế" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLoginDate = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        status: user.status,
        isAdmin: user.isAdmin
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.send("Logged out");
};

const verifyemail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({ verificationToken: code }).select(
      "verificationTokenExpireAt email name isVerified"
    );
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }
    if (user.verificationTokenExpireAt < Date.now()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpireAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    return res
      .status(200)
      .json({ message: "Email verified successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const mailForgotPassword = async (req, res) => {
  console.log("req.body: ", req.body)
  const { email } = req.body;
  try {

    const user = await User.findOne({ email });

    console.log("user: ", user)

    if (!user) {
      return res
        .status(400)
        .json({ message: "Your mail incorrect" });
    }

    const newPass = generateForgotPassword()
    console.log(newPass)

    const hashedPassword = await bcryptjs.hash(newPass, 10);

    user.password = hashedPassword


    
    
    sendMail({
      email: email,
      subject: 'Thông báo từ pickleball: Forgot password!',
      html: `
          <p>Hello,<strong>${user.name}</strong></p><br>
          <p>Your new password: <span style="color: blue; font-weight: bold;">${newPass}</span>. <br>Thanks for use our service <3 </p>
          <span style="color: red; font-weight: bold;">WARNING: Do not share</span> 
      `
    });

    await user.save();

    return res
      .status(200)
      .json({ message: "Check Your Email", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpireAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpireAt = resetTokenExpireAt;

    await user.save();
    await sendForgotPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    return res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  
 
  try {
    
    
    const user = await User.findById(id);

    // Kiểm tra nếu user không tồn tại
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordCorrect = await bcryptjs.compare(data.oldPassword, user.password);

    if(isPasswordCorrect === false){
      return res.status(404).json({ success: false, message: "Old password not true" });
    }

    const hashedPassword = await bcryptjs.hash(data.confirmPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};



const authController = {
  register,
  login,
  logout,
  verifyemail,
  mailForgotPassword,
  forgotPassword,
  resetPassword,
  checkAuth,
};

module.exports = authController;
