const jwt = require("jsonwebtoken");
const Staff = require("../models/Staff");

module.exports = (req, resp, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.TOKEN_SECRET,
      (error, decode) => {
        if (error) resp.status(401).send({ message: "Invalid Token" });
        // const user =
        Staff.findOne({ _id: decode.id }).exec((err, user) => {
          if (err) {
            resp.status(500).send({
              message: err,
            });
          } else {
            req.user = user;
            next();
          }
        });
      }
    );
  } else {
    resp
      .status(401)
      .send({ message: "Authentication credentials were not provided." });
  }
};
