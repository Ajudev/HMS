const router = require("express").Router();
const wardAdmissionValidate = require("../validations/WardAdmissionValidation");
const Patient = require("../models/Patient");
const WardAdmission = require("../models/WardAdmissions");
const ObjectId = require("mongodb").ObjectId;
const wardAdmissionDataValidate = require("../validations/UpdateWardAdmissionValidation");
const Ward = require("../models/Ward");

let staff_type_permissions = ["Doctor", "Nurse", "Paramedic", "Clerk", "Admin"];

// endpoint for fetching all ward admission records
router.get("/", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    let wardAdmssionData = [];
    for await (const wardAdmissionDoc of WardAdmission.find()) {
      const wardAdmissionDetails = {
        admission_id: wardAdmissionDoc._id,
        patient_id: wardAdmissionDoc.patient_id,
        ward_id: wardAdmissionDoc.ward_id.toString(),
        admission_date: wardAdmissionDoc.admission_date,
        discharge_date: wardAdmissionDoc.discharge_date,
        discharge_summary: wardAdmissionDoc.discharge_summary,
        home_treatment_plan: wardAdmissionDoc.home_treatment_plan,
      };
      wardAdmssionData.push(wardAdmissionDetails);
    }
    return resp.status(200).send({ data: wardAdmssionData });
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

// endpoint for fetching ward admission records by given admission id
router.get("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const wardAdmissionDetails = await WardAdmission.findOne({
      _id: ObjectId(id),
    });

    if (!wardAdmissionDetails)
      return resp.status(400).send({ message: "Admission Details not found" });

    const user = await Patient.findOne({
      _id: ObjectId(wardAdmissionDetails.patient_id),
    });
    return resp.status(200).send({
      admission_id: wardAdmissionDetails._id,
      patient_id: wardAdmissionDetails.patient_id,
      ward_id: wardAdmissionDetails.ward_id.toString(),
      admission_date: wardAdmissionDetails.admission_date,
      discharge_date: wardAdmissionDetails.discharge_date,
      discharge_summary: wardAdmissionDetails.discharge_summary,
      home_treatment_plan: wardAdmissionDetails.home_treatment_plan,
    });
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

//endpoint for creating a new ward admission for a patient
router.post("/", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const wardCheck = Ward.findOne({
      _id: ObjectId(req.body.ward_id),
    });
    if (!wardCheck)
      return resp.status(404).send({ message: "Ward with given id not found" });
    let wardAdmissionData = {
      patient_id: req.body.patient_id,
      ward_id: req.body.ward_id,
      admission_date: req.body.admission_date,
      discharge_date: req.body.discharge_date,
      discharge_summary: req.body.discharge_summary,
      home_treatment_plan: req.body.home_treatment_plan,
    };

    const wardAdmissionError = wardAdmissionValidate(wardAdmissionData);
    if (wardAdmissionError.error)
      return resp
        .status(400)
        .send({ error: wardAdmissionError.error.details[0].message });

    try {
      const warAdmission = new WardAdmission(wardAdmissionData);
      await warAdmission.save();
      resp
        .status(200)
        .send({ status: "Success", message: "WardAdmission Created" });
    } catch (err) {
      resp.status(400).send(err);
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

//endpoint for updating an existing ward admission details
router.put("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const updatewardAdmissionError = wardAdmissionDataValidate(req.body);
    if (updatewardAdmissionError.error)
      return resp
        .status(400)
        .send({ error: updatewardAdmissionError.error.details[0].message });
    try {
      const updateStatus = await WardAdmission.findByIdAndUpdate(id, req.body);
      return resp
        .status(200)
        .send({ message: "WardAdmission Details updated" });
    } catch (err) {
      return resp.status(500).send({ error: err });
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

// endpoint for deleting an existing ward admission record from HMS
router.delete("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const wardAdmissionData = await WardAdmission.findOne({
      _id: ObjectId(id),
    });
    if (!wardAdmissionData)
      return resp.status(400).send({ message: "Admission Details not found" });
    try {
      await WardAdmission.findByIdAndRemove(id);
      return resp
        .status(200)
        .send({ message: "WardAdmission Details Deleted" });
    } catch (err) {
      return resp.status(500).send({ error: err });
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

module.exports = router;
