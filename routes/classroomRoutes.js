const express = require("express");
const classroomController = require("../controllers/classroomController");

const router = express.Router();

router.post("/", classroomController.createClassroom);
router.get("/", classroomController.getAllClassrooms);
router.delete("/:id", classroomController.deleteClassroomById);

module.exports = router;
