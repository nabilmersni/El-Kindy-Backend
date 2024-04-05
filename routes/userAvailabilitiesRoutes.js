const express = require("express");
const userAvailabilityController = require("../controllers/userAvailabilitiesController");

const router = express.Router();

router.post("/", userAvailabilityController.createUserAvailability);
router.get("/", userAvailabilityController.getAllUserAvailabilities);

router.get(
  "/user/:userId",
  userAvailabilityController.getUserAvailabilitiesByUserId
);

router.get("/:id", userAvailabilityController.getUserAvailabilityById);

router.put("/:id", userAvailabilityController.updateUserAvailability);

router.delete("/:id", userAvailabilityController.deleteUserAvailabilityById);

module.exports = router;
