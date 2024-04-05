const mongoose = require("mongoose");

const availabilitiesSchema = new mongoose.Schema({
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Availabilities = mongoose.model("Availabilities", availabilitiesSchema);

module.exports = Availabilities;
