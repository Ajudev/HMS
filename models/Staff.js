const mongoose = require("mongoose");
const staffSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  languages: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  staff_type: {
    type: String,
    required: true,
  },
  join_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Staff", staffSchema);
