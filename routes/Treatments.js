const router = require("express").Router();
const treatmentValidate = require("../validations/TreatmentValidation");
const Treatment = require("../models/Treatments");
const DailyReports = require("../models/DailyReports");
const ObjectId = require("mongodb").ObjectId;
const treatmentDataValidate = require("../validations/UpdateTreatmentValidation");

let staff_type_permissions = ["Doctor", "Nurse", "Admin"];

// endpoint for fetching all patient details
router.get("/all", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    let treatmentData = [];
    for await (const treatmentDoc of Treatment.find()) {
      const reportsData = await DailyReports.find({
        treatment_id: treatmentDoc._id,
      });
      const treatmentDetails = {
        treatment_id: treatmentDoc._id,
        admission_id: treatmentDoc.admission_id,
        doctor_id: treatmentDoc.doctor_id,
        diagnosis: treatmentDoc.diagnosis,
        treatment: treatmentDoc.treatment,
        prescription: treatmentDoc.prescription,
        daily_reports: reportsData,
      };
      treatmentData.push(treatmentDetails);
    }
    return resp.status(200).send({ data: treatmentData });
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

// endpoint for fetching patient via id
router.get("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const treatmentDetails = await Treatment.findOne({
      _id: ObjectId(id),
    });

    if (!treatmentDetails)
      return resp
        .status(400)
        .send({ message: "Treatment record with given id not found" });

    const reportsData = await DailyReports.find({
      treatment_id: treatmentDetails._id,
    });

    return resp.status(200).send({
      treatment_id: treatmentDetails._id,
      admission_id: treatmentDetails.admission_id,
      doctor_id: treatmentDetails.doctor_id,
      diagnosis: treatmentDetails.diagnosis,
      treatment: treatmentDetails.treatment,
      prescription: treatmentDetails.prescription,
      daily_reports: reportsData,
    });
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

router.post("/", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    let treatmentData = {
      admission_id: req.body.admission_id,
      doctor_id: req.body.doctor_id,
      diagnosis: req.body.diagnosis,
      treatment: req.body.treatment,
      prescription: req.body.prescription,
    };

    const treatmentError = treatmentValidate(treatmentData);
    if (treatmentError.error)
      return resp
        .status(400)
        .send({ error: treatmentError.error.details[0].message });

    try {
      const treatment = new Treatment(treatmentData);
      await treatment.save();
      resp
        .status(200)
        .send({ status: "Success", message: "Treatment document Created" });
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
    const updateTreatmentError = treatmentDataValidate(req.body);
    if (updateTreatmentError.error)
      return resp
        .status(400)
        .send({ error: updatePatientError.error.details[0].message });
    try {
      const updateStatus = await Treatment.findByIdAndUpdate(id, req.body);
      return resp.status(200).send({ message: "Treatment Details updated" });
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
    const treatmentData = await Treatment.findOne({ _id: ObjectId(id) });
    if (!treatmentData)
      return resp.status(400).send({ message: "Treatment data not found" });
    try {
      await Treatment.findByIdAndRemove(id);
      return resp.status(200).send({ message: "Treatment Details Deleted" });
    } catch (err) {
      return resp.status(500).send({ error: err });
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

module.exports = router;
