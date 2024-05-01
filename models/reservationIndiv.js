const mongoose = require("mongoose");

const reservationIndivSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  availabilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Availabilities",
    required: true,
  },
});

const ReservationIndiv = mongoose.model(
  "ReservationIndiv",
  reservationIndivSchema
);

module.exports = ReservationIndiv;
