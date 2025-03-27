const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    court: { type: mongoose.Schema.Types.ObjectId, ref: "Court", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Feedback = mongoose.model('Feedback', feedbackSchema)

module.exports = Feedback;
