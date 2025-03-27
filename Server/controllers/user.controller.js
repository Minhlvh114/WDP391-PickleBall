const db = require('../models');
const mongoose = require("mongoose");

const User = db.User;

const getUser = async (req, res) => {
    const userId = req.params.id;
    console.log('User ID:', userId);

    try {
          // Validate ObjectId
          console.log('User ID:', userId);
        // if (!mongoose.Types.ObjectId.isValid(userId)) {
        //   return res.status(400).json({ success: false, message: 'Invalid user ID' });
        // }
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({ success: true, user });
    } catch (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ success: true, usersList: users });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ isAdmin: false });
    return res.status(200).json({ success: true, membersList: members });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  
  console.log('Updating user:', userId);
  console.log('Updated data:', updatedData);
  
  try {
    // Sử dụng findByIdAndUpdate với { new: true, runValidators: false } 
    // để tránh validation cho toàn bộ document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      { 
        new: true,       // Trả về document đã cập nhật
        runValidators: false  // Không chạy validation cho những field không cập nhật
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(400).json({ success: false, message: 'Failed to update user', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, deletedUser: user });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.isValidPassword(currentPassword)) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.setPassword(newPassword);
    user.firstLogin = false;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

// Thêm phương thức tạo user mới
const addUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log('Creating new user with data:', userData);
    
    // Tạo user mới
    const newUser = new User(userData);
    
    // Nếu có password, set password
    if (userData.password) {
      newUser.setPassword(userData.password);
    }
    
    // Lưu user mới
    await newUser.save();
    
    return res.status(201).json({ 
      success: true, 
      message: 'User created successfully',
      user: newUser 
    });
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(400).json({ 
      success: false, 
      message: 'Failed to create user', 
      error: err.message 
    });
  }
};

const userController = {
  getUser,
  getAllUsers,
  getAllMembers,
  updateUser,
  deleteUser,
  changePassword,
  addUser
};

module.exports = userController;