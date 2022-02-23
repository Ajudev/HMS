const router = require("express").Router();
const dailyReportValidate = require("../validations/DailyReportValidation");
const DailyReport = require("../models/DailyReports");

const ObjectId = require("mongodb").ObjectId;
const dailyReportDataValidate = require("../validations/UpdateDailyReportValidation");

let staff_type_permissions = ["Doctor", "Nurse", "Paramedic", "Admin"];

// endpoint for fetching all report details
router.get("/all", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    let dailyReportData = [];
    for await (const dailyreportDoc of DailyReport.find()) {
      const dailyReportDetails = {
        report_id: dailyreportDoc._id,
        hourly_temperature: dailyreportDoc.hourly_temperature,
        blood_pressure: dailyreportDoc.blood_pressure,
        pulse_rate: dailyreportDoc.pulse_rate,
        treatment_id: dailyreportDoc.treatment_id,
      };
      dailyReportData.push(dailyReportDetails);
    }
    return resp.status(200).send({ data: dailyReportData });
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

// endpoint for fetching report via id
router.get("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;

    const dailyReportDetails = await DailyReport.findOne({
      _id: ObjectId(id),
    });

    if (!dailyReportDetails)
      return resp
        .status(400)
        .send({ message: "Report with given id not found" });

    return resp.status(200).send({
      report_id: dailyReportDetails._id,
      hourly_temperature: dailyReportDetails.hourly_temperature,
      blood_pressure: dailyReportDetails.blood_pressure,
      pulse_rate: dailyReportDetails.pulse_rate,
      treatment_id: dailyReportDetails.treatment_id,
    });
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

// endpoint to post a new report to HMS system
router.post("/", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    let dailyReportData = {
      hourly_temperature: req.body.hourly_temperature,
      blood_pressure: req.body.blood_pressure,
      pulse_rate: req.body.pulse_rate,
      treatment_id: req.body.treatment_id,
      report_date: req.body.report_date,
    };

    const dailyReportError = dailyReportValidate(dailyReportData);
    if (dailyReportError.error)
      return resp
        .status(400)
        .send({ error: dailyReportError.error.details[0].message });

    try {
      const dailyReport = new DailyReport(dailyReportData);
      await dailyReport.save();
      resp
        .status(200)
        .send({ status: "Success", message: "DailyReport Created" });
    } catch (err) {
      resp.status(400).send(err);
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

// endpoint to update an existing report with given id
router.put("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const updateDailyReportError = dailyReportDataValidate(req.body);
    if (updateDailyReportError.error)
      return resp
        .status(400)
        .send({ error: updateDailyReportError.error.details[0].message });
    try {
      const updateStatus = await DailyReport.findByIdAndUpdate(id, req.body);
      return resp.status(200).send({ message: "DailyReport Details updated" });
    } catch (err) {
      return resp.status(500).send({ error: err });
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

// endpoint to delete a report with given id
router.delete("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const dailyReportData = await DailyReport.findOne({ _id: ObjectId(id) });
    if (!dailyReportData)
      return resp.status(400).send({ message: "DailyReport data not found" });
    try {
      await DailyReport.findByIdAndRemove(id);
      return resp.status(200).send({ message: "DailyReport Details Deleted" });
    } catch (err) {
      return resp.status(500).send({ error: err });
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

module.exports = router;
