const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/auth/google", authController.authGoogle);
router.post("/auth/faceID", authController.authFaceID);
router.post("/logout", authController.logout);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser);

// Protect all routes after this middleware
router.use(authController.isLoggedIn);

router.post("/auth/faceIDRegistration/:id", authController.faceIDRegistration);
router.post("/updateMe", userController.updateMe);

// only admin routes
router.get(
  "/",
  authController.restrictedTo("admin"),
  userController.getAllUsers
);
router.patch("/block/:id", userController.blockUser);

module.exports = router;
