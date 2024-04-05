const express = require("express");
const subCategoryController = require("../controllers/subCategoriesController");

const router = express.Router();

router.post("/", subCategoryController.createSubCategory);
router.get("/", subCategoryController.getAllSubCategories);
router.delete("/:id", subCategoryController.deleteSubCategoryById);
router.get("/:id", subCategoryController.getSubCategoryById);
router.post("/upload/:id", subCategoryController.uploadImage);
router.post("/uploadVideo/:id", subCategoryController.uploadVideo);
router.put("/:id", subCategoryController.updateSubCategory);
router.get("/:id/courses", subCategoryController.getCoursesBySubCategoryId);

module.exports = router;
