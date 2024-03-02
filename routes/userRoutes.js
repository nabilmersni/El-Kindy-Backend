const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/", userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser);

router.patch("/block/:id", userController.blockUser);

// Protect all routes after this middleware
// router.use(authController.protect);

// router.use(authController.restrictTo("admin"));

module.exports = router;
