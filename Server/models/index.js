const mongoose = require("mongoose");
const Court = require("./court.model");
const Bill = require("./bill.model");
const User  = require("./user.model")



mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.court = Court;
db.bill = Bill;
db.user = User;

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
