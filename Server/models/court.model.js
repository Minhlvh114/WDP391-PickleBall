const mongoose = require("mongoose")

const courtSchema = new mongoose.Schema({
  court_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  courts_photo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  

},{
  timestamps : true
})


const Court = mongoose.model('Court', courtSchema)

module.exports = Court;