const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const patient = require("./routes/Patient");
const authorization = require("./middleware/authorization");
const staff = require("./routes/Staff");

const env_config = dotenv.config();
const port = env_config.parsed.PORT;

mongoose.connect(
  "mongodb+srv://devops:devops@cluster0.5pnjk.mongodb.net/DevOpsCW?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to database")
);

app.use(express.json());

app.use("/api/staff", staff);
app.use("/api/patient", authorization, patient);

app.listen(port, () => console.log(`Server running on ${port}`));
