const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const patient = require("./routes/PatientDetails");
const authorization = require("./middleware/authorization");
const staff = require("./routes/Staff");

const env_config = dotenv.config();
const port = env_config.parsed.PORT;

mongoose.connect(
  "mongodb://localhost:27017/hms",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to database")
);

app.use(express.json());

app.use("/api/staff", staff);
app.use("/api/patients", authorization, patient);

app.listen(port, () => console.log(`Server running on ${port}`));
