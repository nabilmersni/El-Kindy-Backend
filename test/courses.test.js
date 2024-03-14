require("dotenv").config({ path: ".env" });

// const chai = require("chai");

// import chai from "chai";

// const expect = chai.expect;
// const should = chai.should();
const chaiHttp = require("chai-http");
// const server = require("../server");
const Course = require("../models/course");
/*
chai.use(chaiHttp);

describe("Test", () => {
  it("should POST a valid course", (done) => {
    let course = {
      courseTitle: "Test Course",
      courseDescription: "Test Description",
      duration: 10,
    };

    chai
      .request(server)
      .post("/api/courses")
      .send(course)
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
});
*/
