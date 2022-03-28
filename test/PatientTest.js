let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("patient endpoint", () => {
  it("check if /patient/all endpoint works", (done) => {
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
        res.body.should.have.property("accessToken");
        let token = res.body.accessToken;
        chai
          .request(server)
          .get("/api/patient/all")
          .set("Authorization", `JWT ${token}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.data.should.be.a("array");
            done();
          });
      });
  });
});
