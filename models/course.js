const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseTitle: String,
  courseDescription: String,
  imageUrl: String,
  courseType: String,
  courseCategory: String,
  courseLevel: String,
  coursePrice: Number,
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
