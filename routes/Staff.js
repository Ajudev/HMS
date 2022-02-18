const router = require("express").Router();
const User = require("../models/User");
const userValidate = require("../validations/UserValidation");
const staffValidate = require("../validations/StaffValidation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");
const authorization = require("../middleware/authorization");

router.post("/register", async (req, resp) => {
  const userData = {
    name: req.body.name,
    contact: req.body.contact,
    gender: req.body.gender,
    address: req.body.address,
    dob: req.body.dob,
  };
  const userError = userValidate(userData);
  if (userError.error)
    return resp.status(400).send({ error: userError.error.details[0].message });
  const exist_staff = await Staff.findOne({ email: req.body.email });
  if (exist_staff) {
    return resp.status(400).send({
      status: "Failed",
      message: "User with email address exists",
    });
  }

  const hashedPassword = await bcrypt.hashSync(req.body.password);
  let staffData = {
    email: req.body.email,
    password: hashedPassword,
    department: req.body.department,
    education: req.body.education,
    languages: req.body.languages,
    staff_type: req.body.staff_type,
  };

  const staffError = staffValidate(staffData);
  if (staffError.error)
    return resp
      .status(400)
      .send({ error: staffError.error.details[0].message });
  const user = new User(userData);

  try {
    await user.save();
    staffData.user_id = user._id;
    const staff = new Staff(staffData);
    await staff.save();
    resp.status(200).send({ status: "Success", message: "Staff Created" });
  } catch (err) {
    resp.status(400).send(err);
  }
});

router.post("/login", async (req, resp) => {
  const { email, password } = req.body;
  const user = await Staff.findOne({ email: email });
  if (!user) {
    return resp.status(404).send({
      status: "Failed",
      message: "User with email address not found",
    });
  }
  const passwordValid = bcrypt.compareSync(password, user.password);
  if (!passwordValid) {
    return resp.status(401).send({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: 86400,
    }
  );
  return resp.status(200).send({
    user: {
      id: user._id,
      email: user.email,
    },
    message: "Login successfull",
    accessToken: token,
  });
});

router.post("/logout", authorization, (req, resp) => {
  resp.status(200).send({ message: "Logout Successful" });
});

module.exports = router;
