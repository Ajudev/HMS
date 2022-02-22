const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const patient = require("./routes/Patient");
const authorization = require("./middleware/authorization");
const staff = require("./routes/Staff");

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

app.listen(port, () => console.log(`Server running on ${port}`));
