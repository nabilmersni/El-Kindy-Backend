const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/auth/google", authController.authGoogle);
router.post("/auth/faceID", authController.authFaceID);
router.post("/logout", authController.logout);
router.post("/verifyEmail", authController.verifyEmail);
router.post("/forgotPasswordRequest", authController.forgotPasswordRequest);
router.post("/forgotPassword", authController.forgotPassword);

router.route("/:id").get(userController.getUser);
// .patch(userController.updateUser);

// Protect all routes after this middleware
router.use(authController.isLoggedIn);

router.post("/auth/faceIDRegistration/:id", authController.faceIDRegistration);
router.post("/updateMe", userController.updateMe);
router.patch("/user/changePassword", authController.changePassword);

router.get(
  "/",
  // authController.restrictedTo("admin"),
  userController.getAllUsers
);

router.get("/get/loggedUser", authController.getLoggedUser);

// only admin routes
router.get(
  "/count/stats",
  authController.restrictedTo("admin"),
  userController.getUserCounts
);
router.post(
  "/addUser",
  authController.restrictedTo("admin"),
  userController.addser
);
router.patch(
  "/block/:id",
  authController.restrictedTo("admin"),
  userController.blockUser
);
router.patch(
  "/:id",
  authController.restrictedTo("admin"),
  userController.updateUser
);
router.patch(
  "/acceptCV/:id",
  authController.restrictedTo("admin"),
  userController.acceptCV
);

module.exports = router;
