const router = require("express").Router();
const Ward = require("../models/Ward");
const wardValidate = require("../validations/WardValidation");
const ObjectId = require("mongodb").ObjectId;

let staff_type_permissions = ["Admin"];

// endpoint for fetching all ward details from HMS system
router.get("/all", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    let wardData = [];
    for await (const doc of Ward.find()) {
      const wardDetails = {
        ward_id: doc._id.toString(),
        name: doc.name,
        capacity: doc.capacity,
        department: doc.department,
      };
      wardData.push(wardDetails);
    }
    return resp.status(200).send({ data: wardData });
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

// endpoint for fetching ward details with given ward_id
router.get("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const wardDetails = await Ward.findOne({
      _id: ObjectId(id),
    });
    if (!wardDetails)
      return resp.status(400).send({ message: "Ward Details not found" });

    return resp.status(200).send({
      ward_id: wardDetails._id.toString(),
      name: wardDetails.name,
      capacity: wardDetails.capacity,
      department: wardDetails.department,
    });
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

//endpoint which will create a new ward in HMS system
router.post("/", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const wardData = {
      name: req.body.name,
      capacity: req.body.capacity,
      department: req.body.department,
    };
    const wardError = wardValidate(wardData);
    if (wardError.error)
      return resp
        .status(400)
        .send({ error: wardError.error.details[0].message });

    try {
      const ward = new Ward(wardData);
      await ward.save();
      resp.status(200).send({ status: "Success", message: "Ward Created" });
    } catch (err) {
      resp.status(400).send(err);
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

//endpoint which will update an existing ward details in HMS
router.put("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const updateWardError = wardValidate(req.body, "update");
    if (updateWardError.error)
      return resp
        .status(400)
        .send({ error: updateWardError.error.details[0].message });
    try {
      const updateStatus = await Ward.findByIdAndUpdate(id, req.body);
      return resp.status(200).send({ message: "Ward Details updated" });
    } catch (err) {
      return resp.status(500).send({ error: err });
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

//endpoint which will delete a ward from the HMS system
router.delete("/:id", async (req, resp) => {
  if (staff_type_permissions.includes(req.user.staff_type)) {
    const { id } = req.params;
    const wardData = await Ward.findOne({ _id: ObjectId(id) });
    if (!wardData)
      return resp.status(400).send({ message: "Ward data not found" });
    try {
      await Ward.findByIdAndRemove(id);
      return resp.status(200).send({ message: "Ward Details Deleted" });
    } catch (err) {
      return resp.status(500).send({ error: err });
    }
  } else {
    return resp.status(401).send({ message: "Unauthorized user" });
  }
});

module.exports = router;
