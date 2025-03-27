const mongoose = require("mongoose")

const borrowerSchema = new mongoose.Schema({
  time_rental: {
    type: String,
    required: false
  },
  end_time_rental: {
    type: String,
    required: false
  },
  court_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true
  },
  bill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: false
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['success', 'pending', 'cancel'],
    default: 'pending',
    required: true,
  },
},{
  timestamps : true
})


const Borrower = mongoose.model('Borrower', borrowerSchema)

module.exports = Borrower;