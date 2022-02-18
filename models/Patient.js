const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  weight: {
    type: mongoose.Schema.Types.Decimal128,
  },
  height: {
    type: Number,
  },
  blood_type: {
    type: String,
    required: true,
    max: 10,
  },
  emergency_contact: {
    type: String,
    required: true,
  },
  insurance: {
    type: String,
  },
});

module.exports = mongoose.model("Patient", userSchema);
