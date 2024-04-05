const mongoose = require("mongoose");

const userAvailabilitiesSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const UserAvailabilities = mongoose.model(
  "UserAvailabilities",
  userAvailabilitiesSchema
);

module.exports = UserAvailabilities;
