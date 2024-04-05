const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  subCategoryTitle: {
    type: String,
    required: true,
  },
  imageUrl: String,
  videoUrl: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
