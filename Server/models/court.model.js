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
  court_photo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  opening_hours: {
    type: String,
    default: "06:00 - 22:00"
  }
},{
  timestamps : true
})


const Court = mongoose.model('Court', courtSchema)

module.exports = Court;