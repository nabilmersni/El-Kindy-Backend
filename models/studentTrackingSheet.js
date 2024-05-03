const mongoose = require("mongoose");

const studentTrackingSheetSchema = new mongoose.Schema({
  date: {
    type: Date,
    // required: true,
  },
  duration: {
    type: String,
    // required: true,
  },
  courseContent: {
    type: String,
    // required: true,
  },
  observation: {
    type: String,
    // required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
});

const StudentTrackingSheet = mongoose.model(
  "StudentTrackingSheet",
  studentTrackingSheetSchema
);

module.exports = StudentTrackingSheet;
