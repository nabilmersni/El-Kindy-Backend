const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseTitle: String,
  courseDescription: String,
  imageUrl: String,
  courseType: String,
  courseCategory: String,
  courseLevel: String,
  coursePrice: Number,
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
