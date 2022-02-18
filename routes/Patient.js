const router = require("express").Router();
const patientValidate = require("../validations/PatientValidation");
const userValidate = require("../validations/UserValidation");
const Patient = require("../models/Patient");
const User = require("../models/User");

router.post("/register", async (req, resp) => {
  if (req.user.staff_type === "Clerk") {
    const userData = {
      name: req.body.name,
      contact: req.body.contact,
      gender: req.body.gender,
      address: req.body.address,
      dob: req.body.dob,
    };
    const userError = userValidate(userData);
    if (userError.error)
      return resp
        .status(400)
        .send({ error: userError.error.details[0].message });
    const existPatient = await Patient.findOne({ contact: req.body.contact });
    if (existPatient) {
      return resp.status(400).send({
        status: "Failed",
        message: "User with given details already exists",
      });
    }
    let patientData = {
      weight: req.body.weight,
      height: req.body.height,
      blood_type: req.body.blood_type,
      emergency_contact: req.body.emergency_contact,
      insurance: req.body.insurance,
    };

    const patientError = patientValidate(patientData);
    if (patientError.error)
      return resp
        .status(400)
        .send({ error: patientError.error.details[0].message });
    const user = new User(userData);

    try {
      await user.save();
      patientData.user_id = user._id;
      const patient = new Patient(patientData);
      await patient.save();
      resp.status(200).send({ status: "Success", message: "Patient Created" });
    } catch (err) {
      resp.status(400).send(err);
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

module.exports = router;
