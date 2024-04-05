const express = require("express");
const groupController = require("../controllers/groupController");

const router = express.Router();

router.post("/", groupController.createGroup);
router.get("/", groupController.getAllGroups);
router.delete("/:id", groupController.deleteGroupById);
router.get("/:id", groupController.getGroupById);
router.put("/:id", groupController.updateGroup);

module.exports = router;
