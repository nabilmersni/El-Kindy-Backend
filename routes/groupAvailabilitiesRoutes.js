const express = require("express");
const groupAvailabilitiesController = require("../controllers/groupAvailabilitiesController");

const router = express.Router();

router.post("/", groupAvailabilitiesController.createGroupAvailabilities);
router.get("/", groupAvailabilitiesController.getAllGroupAvailabilities);
router.delete(
  "/:id",
  groupAvailabilitiesController.deleteGroupAvailabilitiesById
);
router.get("/:id", groupAvailabilitiesController.getGroupAvailabilitiesById);
router.put("/:id", groupAvailabilitiesController.updateGroupAvailabilities);

router.get(
  "/filter/groupAvailabilities",
  groupAvailabilitiesController.getSelectedProperties
);

module.exports = router;
