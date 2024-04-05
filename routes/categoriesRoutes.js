const express = require("express");
const categoryController = require("../controllers/categoriesController");

const router = express.Router();

router.post("/", categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.delete("/:id", categoryController.deleteCategoryById);
router.get("/:id", categoryController.getCategoryById);
router.post("/upload/:id", categoryController.uploadImage);
router.put("/:id", categoryController.updateCategory);

module.exports = router;
