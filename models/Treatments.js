const mongoose = require("mongoose");
const treatmentSchema = new mongoose.Schema({
  admission_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WardAdmissions",
    required: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
    required: true
  },

  diagnosis: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },

  prescription: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Treatments", treatmentSchema);