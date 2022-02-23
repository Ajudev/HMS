const router = require("express").Router();
const patientValidate = require("../validations/PatientValidation");
const userValidate = require("../validations/UserValidation");
const Patient = require("../models/Patient");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;

let staff_type_permissions = ["Doctor", "Nurse", "Paramedic", "Clerk", "Admin"];

// endpoint for fetching all patient details
router.get("/all", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    let patientData = [];
    for await (const doc of Patient.find()) {
      const userData = await User.findOne({ _id: doc.user_id });
      const patientDetails = {
        patient_id: doc._id.toString(),
        name: userData.name,
        contact: userData.contact,
        gender: userData.gender,
        address: userData.address,
        dob: userData.dob,
        weight: parseFloat(doc.weight),
        height: doc.height,
        blood_type: doc.blood_type,
        emergency_contact: doc.emergency_contact,
        insurance: doc.insurance,
      };
      patientData.push(patientDetails);
    }
    return resp.status(200).send({ data: patientData });
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

// endpoint for fetching patient via id
router.get("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const patientDetails = await Patient.findOne({
      _id: ObjectId(id),
    });
    if (!patientDetails)
      return resp.status(400).send({ message: "Patient not found" });

    const user = await User.findOne({
      _id: ObjectId(patientDetails.user_id),
    });
    return resp.status(200).send({
      patient_id: patientDetails._id.toString(),
      name: user.name,
      contact: user.contact,
      gender: user.gender,
      address: user.address,
      dob: user.dob,
      weight: parseFloat(patientDetails.weight),
      height: patientDetails.height,
      blood_type: patientDetails.blood_type,
      emergency_contact: patientDetails.emergency_contact,
      insurance: patientDetails.insurance,
    });
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

router.post("/register", async (req, resp) => {
  staff_type_permissions = ["Clerk", "Admin"];
  if (staff_type_permissions.includes(req.user.staff_type)) {
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
    const existPatient = await User.findOne({ contact: req.body.contact });
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

    const patientError = patientValidate(patientData, "create");
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

router.put("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const updatePatientError = patientValidate(req.body, "update");
    if (updatePatientError.error)
      return resp
        .status(400)
        .send({ error: updatePatientError.error.details[0].message });
    try {
      const updateStatus = await Patient.findByIdAndUpdate(id, req.body);
      return resp.status(200).send({ message: "Patient Details updated" });
    } catch (err) {
      return resp.status(500).send({ error: err });
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

router.delete("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const patientData = await Patient.findOne({ _id: ObjectId(id) });
    if (!patientData)
      return resp.status(400).send({ message: "Patient data not found" });
    try {
      await Patient.findByIdAndRemove(id);
      await User.findByIdAndRemove(patientData.user_id);
      return resp.status(200).send({ message: "Patient Details Deleted" });
    } catch (err) {
      return resp.status(500).send({ error: err });
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

module.exports = router;
