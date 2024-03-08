const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/auth/google", authController.authGoogle);
router.post(
  "/auth/faceIDRegistration/:id",
  authController.isLoggedIn,
  authController.faceIDRegistration
);
router.post("/auth/faceID", authController.authFaceID);

router.post("/logout", authController.logout);
router.get("/get/loggedUser", authController.getLoggedUser);

// router.get("/", authController.isLoggedIn, userController.getAllUsers);
router.get("/", userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser);

router.patch("/block/:id", userController.blockUser);
router.post("/updateMe", authController.isLoggedIn, userController.updateMe);
// router.post("/updateMe", userController.updateMe);

// Protect all routes after this middleware
// router.use(authController.protect);

// router.use(authController.restrictTo("admin"));

module.exports = router;
