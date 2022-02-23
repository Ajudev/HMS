const mongoose = require("mongoose");
const wardAdmissionSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },

  ward_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ward",
    required: true,
  },

  admission_date: {
    type: Date,
    default: Date.now,
  },

  discharge_date: {
    type: Date,
  },

  discharge_summary: {
    type: String,
  },

  home_treatment_plan: {
    type: String,
  },
});

module.exports = mongoose.model("WardAdmissions", wardAdmissionSchema);
