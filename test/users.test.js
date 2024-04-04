// describe("BasicTest", function () {
//   describe("Multiplication", function () {
//     it("should equal 15 when 5 is multiplied by 3", function () {
//       const result = 5 * 3;
//       assert.equal(result, 15);
//     });
//   });
// });

const assert = require("assert");
const sinon = require("sinon"); // For mocking functions
const UserController = require("../controllers/userController");
const User = require("../models/userModel");

describe("UserController", function () {
  describe("getAllUsers", function () {
    it("should return all users", async function () {
      // Mocking User.find() function
      sinon.stub(User, "find").resolves(["user1", "user2"]);

      const req = {};
      const res = {
        status: function (code) {
          assert.equal(code, 200);
          return this; // For chaining
        },
        json: function (data) {
          assert.equal(data.status, "success");
          assert.equal(data.results, 2);
          assert.deepEqual(data.data.users, ["user1", "user2"]);
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.getAllUsers(req, res, next);

      sinon.restore(); // Restore original function
    });
  });

  describe("getUser", function () {
    it("should return the user if found", async function () {
      // Stubbing User.findById() function to resolve with a dummy user
      const dummyUser = { _id: "dummyId", name: "Dummy User" };
      sinon.stub(User, "findById").resolves(dummyUser);

      const req = { params: { id: "dummyId" } };
      const res = {
        status: function (code) {
          assert.equal(code, 200);
          return this; // For chaining
        },
        json: function (data) {
          assert.equal(data.status, "success");
          assert.deepEqual(data.data.user, dummyUser);
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.getUser(req, res, next);

      sinon.restore(); // Restore original function
    });

    it("should return 404 error if user is not found", async function () {
      // Stubbing User.findById() function to resolve with null (user not found)
      sinon.stub(User, "findById").resolves(null);

      const req = { params: { id: "nonExistentId" } };
      const res = {
        status: function (code) {
          assert.equal(code, 404);
          return this; // For chaining
        },
        json: function (data) {
          assert.equal(data.status, "error");
          assert.equal(data.message, "User not found");
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.getUser(req, res, next);

      sinon.restore(); // Restore original function
    });
  });

  describe("updateUser", function () {
    it("should update the user and return the updated user data", async function () {
      // Stubbing User.findByIdAndUpdate() function to resolve with the updated user
      const updatedUser = { _id: "dummyId", name: "Updated User" };
      sinon.stub(User, "findByIdAndUpdate").resolves(updatedUser);

      const req = {
        params: { id: "dummyId" },
        body: { fullname: "Updated Name", dateOfBirth: "2022-01-01" },
      };
      const res = {
        status: function (code) {
          assert.equal(code, 200);
          return this; // For chaining
        },
        json: function (data) {
          assert.equal(data.status, "success");
          assert.deepEqual(data.data.user, updatedUser);
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.updateUser(req, res, next);

      sinon.restore(); // Restore original function
    });

    it("should return 404 error if user is not found", async function () {
      // Stubbing User.findByIdAndUpdate() function to resolve with null (user not found)
      sinon.stub(User, "findByIdAndUpdate").resolves(null);

      const req = {
        params: { id: "nonExistentId" },
        body: { fullname: "Updated Name", dateOfBirth: "2022-01-01" },
      };
      const res = {
        status: function (code) {
          assert.equal(code, 404);
          return this; // For chaining
        },
        json: function (data) {
          assert.equal(data.status, "error");
          assert.equal(data.message, "User not found");
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.updateUser(req, res, next);

      sinon.restore(); // Restore original function
    });
  });

  describe("updateMe", function () {
    afterEach(function () {
      sinon.restore(); // Restore original functions after each test
    });

    it("should update user profile", async function () {
      const updatedUser = {
        _id: "dummyId",
        name: "Updated User",
        email: "dummy@example.com",
      };
      sinon.stub(User, "findByIdAndUpdate").resolves(updatedUser);

      const req = {
        loggedInUser: { _id: "dummyUserId" }, // Simulate logged in user
        body: {
          fullname: "New Name",
          dateOfBirth: "1990-01-01",
          phone: "1234567890",
        }, // New user data
      };
      const res = {
        status: function (code) {
          assert.equal(code, 200);
          return this; // For chaining
        },
        json: function (data) {
          assert.equal(data.status, "success");
          assert.deepEqual(data.data.user, updatedUser);
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.updateMe(req, res, next);

      // Ensure findByIdAndUpdate is called with the correct parameters
      sinon.assert.calledOnceWithExactly(
        User.findByIdAndUpdate,
        req.loggedInUser._id,
        sinon.match.object, // Expecting an object with updated user data
        { new: true, runValidators: true }
      );
    });
  });

  describe("addser", function () {
    afterEach(function () {
      sinon.restore(); // Restore original functions after each test
    });

    it("should add a new user and send a confirmation email", async function () {
      const newUser = {
        _id: "dummyId",
        name: "New User",
        email: "newuser@example.com",
      };
      sinon.stub(User, "create").resolves(newUser);

      const req = {
        body: {
          fullname: "New User",
          dateOfBirth: "1990-01-01",
          email: "newuser@example.com",
          phone: "1234567890",
          role: "user", // Assuming role is not 'admin'
          password: "password",
          confirmPassword: "password",
          // Add other necessary properties here
        },
      };
      const res = {
        status: function (code) {
          assert.equal(code, 201);
          return this; // For chaining
        },
        json: function (data) {
          assert.equal(data.status, "success");
          assert.equal(data.message, "User created successfully!");
          assert.deepEqual(data.data.user, newUser);
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.addser(req, res, next);

      // Ensure User.create is called with the correct parameters
      sinon.assert.calledOnceWithExactly(
        User.create,
        sinon.match.object // Expecting an object with user data
      );
    });

    it("should return a 401 error for admin role", async function () {
      const req = {
        body: { role: "admin" }, // Simulate request with admin role
      };
      const res = {
        status: function (code) {
          assert.equal(code, 401);
          return this; // For chaining
        },
        json: function (data) {
          assert.equal(data.status, "error");
          assert.equal(
            data.message,
            "This route not for add user of type admin"
          );
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.addser(req, res, next);
    });
  });

  describe("getUserCounts", function () {
    afterEach(function () {
      sinon.restore(); // Restore original functions after each test
    });

    it("should return user counts and role counts", async function () {
      const totalUserCount = 10;
      const roleCounts = [
        { _id: "admin", count: 3 },
        { _id: "user", count: 7 },
      ];
      sinon.stub(User, "countDocuments").resolves(totalUserCount);
      sinon.stub(User, "aggregate").resolves(roleCounts);

      const expectedResponse = {
        status: "success",
        data: {
          totalUserCount,
          roleCounts: {
            admin: 3,
            user: 7,
          },
        },
      };

      const req = {};
      const res = {
        status: function (code) {
          assert.equal(code, 200);
          return this; // For chaining
        },
        json: function (data) {
          assert.deepEqual(data, expectedResponse);
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.getUserCounts(req, res, next);

      // Ensure countDocuments and aggregate are called
      sinon.assert.calledOnce(User.countDocuments);
      sinon.assert.calledOnce(User.aggregate);
    });
  });

  describe("acceptCV", function () {
    afterEach(function () {
      sinon.restore(); // Restore original functions after each test
    });

    it("should accept the CV and send an email", async function () {
      const updatedUser = {
        _id: "dummyId",
        name: "User",
        email: "user@example.com",
        isCvAccepted: true,
      };
      sinon.stub(User, "findByIdAndUpdate").resolves(updatedUser);

      const req = {
        params: { id: "dummyId" },
      };
      const res = {
        status: function (code) {
          assert.equal(code, 200);
          return this; // For chaining
        },
        json: function (data) {
          assert.equal(data.status, "success");
          assert.equal(data.data.user, updatedUser);
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.acceptCV(req, res, next);

      // Ensure findByIdAndUpdate is called with the correct parameters
      sinon.assert.calledOnceWithExactly(
        User.findByIdAndUpdate,
        req.params.id,
        { isCvAccepted: true },
        { new: true }
      );
    });

    it("should return a 404 error if user is not found", async function () {
      sinon.stub(User, "findByIdAndUpdate").resolves(null);

      const req = {
        params: { id: "nonExistentId" },
      };
      const res = {
        status: function (code) {
          assert.equal(code, 404);
          return this; // For chaining
        },
        json: function (data) {
          assert.equal(data.status, "error");
          assert.equal(data.message, "User not found");
        },
      };
      const next = sinon.stub(); // Stubbing next function

      await UserController.acceptCV(req, res, next);
    });
  });

  // describe("blockUser", function () {
  //   afterEach(function () {
  //     sinon.restore(); // Restore original functions after each test
  //   });

  //   it("should block the user and send an email", async function () {
  //     const updatedUser = {
  //       _id: "dummyId",
  //       name: "User",
  //       email: "user@example.com",
  //       state: "blocked",
  //     };
  //     sinon.stub(User, "findByIdAndUpdate").resolves(updatedUser);

  //     const req = {
  //       params: { id: "dummyId" },
  //       body: { state: "blocked", blockReasons: "Some reasons" },
  //     };
  //     const res = {
  //       status: function (code) {
  //         assert.equal(code, 200);
  //         return this; // For chaining
  //       },
  //       json: function (data) {
  //         assert.equal(data.status, "success");
  //         assert.equal(data.data.user, updatedUser);
  //       },
  //     };
  //     const next = sinon.stub(); // Stubbing next function

  //     await UserController.blockUser(req, res, next);

  //     // Ensure findByIdAndUpdate is called with the correct parameters
  //     sinon.assert.calledOnceWithExactly(
  //       User.findByIdAndUpdate,
  //       req.params.id,
  //       { state: "blocked" },
  //       { new: true }
  //     );

  //     // Ensure sendEmail is called with the correct parameters
  //     sinon.assert.calledOnceWithExactly(
  //       UserController.sendEmail,
  //       user.email,
  //       "Your EL Kindy account has been suspended.",
  //       sinon.match.string // Assuming email template body
  //     );
  //   });

  //   it("should return a 404 error if user is not found", async function () {
  //     sinon.stub(User, "findByIdAndUpdate").resolves(null);

  //     const req = {
  //       params: { id: "nonExistentId" },
  //       body: { state: "blocked", blockReasons: "Some reasons" },
  //     };
  //     const res = {
  //       status: function (code) {
  //         assert.equal(code, 404);
  //         return this; // For chaining
  //       },
  //       json: function (data) {
  //         assert.equal(data.status, "error");
  //         assert.equal(data.message, "User not found");
  //       },
  //     };
  //     const next = sinon.stub(); // Stubbing next function

  //     await UserController.blockUser(req, res, next);
  //   });
  // });
});
