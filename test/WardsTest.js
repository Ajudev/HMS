let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let should = chai.should();

chai.use(chaiHttp);

describe("/api/wards/all endpoint", () => {
  it("check if /api/wards/all endpoint works", (done) => {
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
        res.body.should.have.property("accessToken");
        let token = res.body.accessToken;
        chai
          .request(server)
          .get("/api/wards/all")
          .set("Authorization", `JWT ${token}`)
          .end((err, res) => {
            res.body.should.be.a("object");
            res.body.should.have.property("data");
            res.body.data.should.be.a("array");
            done();
          });
      });
  });
});
