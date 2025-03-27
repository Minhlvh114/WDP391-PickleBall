const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "7d", // Make expiration configurable
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/", // Ensure cookie is accessible across all routes
  });
};

module.exports = generateTokenAndSetCookie;
