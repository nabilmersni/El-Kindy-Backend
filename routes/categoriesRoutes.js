const express = require("express");
const categoryController = require("../controllers/categoriesController");

const router = express.Router();

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.delete("/:id", categoryController.deleteCategoryById);

module.exports = router;
