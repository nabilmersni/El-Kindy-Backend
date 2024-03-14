const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  classroomName: String,
});

const Classroom = mongoose.model("Classroom", classroomSchema);

module.exports = Classroom;
