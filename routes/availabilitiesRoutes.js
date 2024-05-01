const express = require("express");
const availabilityController = require("../controllers/availabilitiesController");

const router = express.Router();

router.post("/", availabilityController.createAvailability);
router.get("/", availabilityController.getAllAvailabilities);
router.get(
  "/teacher/:teacherId",
  availabilityController.getTeacherAvailabilities
);

router.get(
  "/teacher/:teacherId/reserved",
  availabilityController.getTeacherReservedAvailabilities
);

router.get("/:id", availabilityController.getAvailabilityById);
router.put("/:id", availabilityController.updateAvailability);
router.delete("/:id", availabilityController.deleteAvailabilityById);

router.get("/day/:day", availabilityController.getAllAvailabilitiesByDay);

module.exports = router;
