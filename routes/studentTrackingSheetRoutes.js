const express = require("express");
const studentTrackingSheetController = require("../controllers/studentTrackingSheetController");

const router = express.Router();

router.post("/", studentTrackingSheetController.createStudentTrackingSheet);

router.get("/teacher/:teacherId", studentTrackingSheetController.getByTeacher);

router.get("/", studentTrackingSheetController.getAllStudentTrackingSheets);

router.delete(
  "/:id",
  studentTrackingSheetController.deleteStudentTrackingSheetById
);

router.get("/:id", studentTrackingSheetController.getStudentTrackingSheetById);

router.put("/:id", studentTrackingSheetController.updateStudentTrackingSheet);

module.exports = router;
