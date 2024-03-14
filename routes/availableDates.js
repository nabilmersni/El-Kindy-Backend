const express = require("express");
const availableDatesController = require("../controllers/availableDatesController");

const router = express.Router();

router.post("/", availableDatesController.createAvailableDates);
// router.get("/", categoryController.getAllCategories);
// router.delete("/:id", categoryController.deleteCategoryById);

module.exports = router;
