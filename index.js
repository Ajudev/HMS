const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const patient = require("./routes/Patient");
const authorization = require("./middleware/authorization");
const staff = require("./routes/Staff");
const ward = require("./routes/Ward");
const treatments = require("./routes/Treatments");
const wardAdmission = require("./routes/WardAdmissions");
const dailyReports = require("./routes/DailyReports");

dotenv.config();
const port = process.env.PORT;

mongoose.connect(
  process.env.MONGO_HOST,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to database")
);

app.use(express.json());

app.use("/api/staff", staff);
app.use("/api/patient", authorization, patient);
app.use("/api/wards", authorization, ward);
app.use("/api/Treatments", authorization, treatments);
app.use("/api/WardAdmissions", authorization, wardAdmission);
app.use("/api/DailyReports", authorization, dailyReports);

app.listen(port, () => console.log(`Server running on ${port}`));
