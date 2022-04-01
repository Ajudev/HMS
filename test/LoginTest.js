let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("/POST login", () => {
  it("check if authentication module works", (done) => {
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
        res.body.should.have.property("user");
        res.body.user.should.be.a("object");
        res.body.should.have.property("message");
        res.body.should.have.property("accessToken");
        done();
      });
  });
});
