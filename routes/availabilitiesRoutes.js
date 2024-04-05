const express = require("express");
const availabilityController = require("../controllers/availabilitiesController");

const router = express.Router();

router.post("/", availabilityController.createAvailability);
router.get("/", availabilityController.getAllAvailabilities);
router.get(
  "/teacher/:teacherId",
  availabilityController.getTeacherAvailabilities
);
router.get("/:id", availabilityController.getAvailabilityById);
router.put("/:id", availabilityController.updateAvailability);
router.delete("/:id", availabilityController.deleteAvailabilityById);

module.exports = router;
