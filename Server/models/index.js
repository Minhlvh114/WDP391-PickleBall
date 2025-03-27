const mongoose = require("mongoose");
const Court = require("./court.model");
const User  = require("./user.model")
const Feedback = require("./feedback.model")
const Bill = require("./bill.model");
const Borrower = require("./borrower.model");
const Notification = require("./notification.model");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.court = Court;
db.User = User;
db.Feedback = Feedback
db.bill = Bill;
db.borrower = Borrower
db.Notification = Notification


db.connectDB = async () => {
  try {
    // Đặt cấu hình strictQuery trước khi kết nối
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI, {
 
    });

    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};


module.exports = db;
