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


// Loading to env variables from .env file
dotenv.config();
const port = process.env.PORT;

// Connecting to Mongo DB
mongoose.connect(
  process.env.MONGO_HOST,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to database")
);

app.use(express.json());

// API Route Handler Configuration
app.use("/api/staff", staff);
app.use("/api/patient", authorization, patient);
app.use("/api/wards", authorization, ward);
app.use("/api/Treatments", authorization, treatments);
app.use("/api/WardAdmissions", authorization, wardAdmission);
app.use("/api/DailyReports", authorization, dailyReports);

// running server at port mentioned in env variable
app.listen(port, () => console.log(`Server running on ${port}`));
