const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryTitle: {
    type: String,
    required: true,
  },
  imageUrl: String,
  subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" }],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
