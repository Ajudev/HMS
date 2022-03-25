let mongoose = require("mongoose");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("/POST login", () => {
  it("check if user is valid and return 200 response status", (done) => {
    let staff = {
      email: "admin@gmail.com",
      password: "test123",
    };
    chai
      .request(server)
      .post("/api/staff/login")
      .send(staff)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});
