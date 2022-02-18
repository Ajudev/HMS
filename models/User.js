const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 255,
  },
  contact: {
    type: String,
    required: true,
    min: 7,
    max: 10,
  },
  gender: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  address: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  dob: {
    type: Date,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
