const router = require("express").Router();
const User = require("../models/User");
const userValidate = require("../validations/UserValidation");
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
  const { error } = userValidate(userData);
  if (error) return resp.status(400).send(error.details[0].message);
  await User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) {
      return resp.status(500).send({ status: "Failed", message: error });
    }
    if (user) {
      return resp.status(400).send({
        status: "Failed",
        message: "User with email address exists",
      });
    }
  });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User(userData);

  try {
    const saveUser = await user.save();
    const staff = new Staff({
      user_id: user._id,
      email: req.body.email,
      password: hashedPassword,
      department: req.body.department,
      education: req.body.education,
      languages: req.body.languages,
      staff_type: req.body.staff_type,
    });
    const saveStaff = await staff.save();
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
