const mongoose = require("mongoose")

const billSchema = new mongoose.Schema({
  retal_price: {
    type: Number,
    required: true
  },
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
    required: false
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  counter_account_name: {
    type: String,
    required: true
  },
  counter_account_number: {
    type: String,
    required: true
  },
  order_code_pay_os: {
    type: Number,
    required: true,
    unique:true,
  },
  status: {
    type: String,
    required: true,
  },
  transaction_bank_time: {
    type: String,
    required: false,
  },
  reference_bank: {
    type: String,
    required: false,
    unique:true
  },

},{
  timestamps : true
})


const Bill = mongoose.model('Bill', billSchema)

module.exports = Bill;