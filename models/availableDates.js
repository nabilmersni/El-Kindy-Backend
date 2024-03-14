const mongoose = require("mongoose");

const Days = {
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
  Saturday: "Saturday",
  Sunday: "Sunday",
};

const availableDatesSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: Object.values(Days),
  },

  startTime: String,
  endTime: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const AvailableDates = mongoose.model("AvailableDates", availableDatesSchema);

module.exports = AvailableDates;
