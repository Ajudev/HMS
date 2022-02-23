const mongoose = require("mongoose");
const dailyReportSchema = new mongoose.Schema({
  
  hourly_temperature: {
    type: Number,
    required: true
  },
  blood_pressure: {
    type: Number,
    required: true
  },

  pulse_rate: {
    type: Number,
    required: true
  },

  treatment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Treatments"
  },

  report_date: {
    type: Date
  }
});

module.exports = mongoose.model("DailyReports", dailyReportSchema);