const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    // photo_url: { type: String, required: false, nullable: true },
    dob: { type: Date, default: null },
  
    lastLoginDate: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpireAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpireAt: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema)

module.exports = User;