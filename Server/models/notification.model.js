const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
const Notification =  mongoose.model("Notification", notificationSchema);

module.exports = Notification;

