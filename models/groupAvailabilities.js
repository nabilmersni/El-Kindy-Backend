const mongoose = require("mongoose");

const groupAvailabilitiesSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
});

const GroupAvailabilities = mongoose.model(
  "GroupAvailabilities",
  groupAvailabilitiesSchema
);

module.exports = GroupAvailabilities;
