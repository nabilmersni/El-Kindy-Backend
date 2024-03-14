const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryTitle: String,
  categoryDescription: String,
  imageUrl: String,
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
