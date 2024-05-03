const express = require("express");
const courseController = require("../controllers/courseController");

const router = express.Router();

router.post("/", courseController.createCourse);
router.get("/", courseController.getAllCourses);
router.delete("/:id", courseController.deleteCourseById);
router.get("/:id", courseController.getCourseById); // Ajoutez cette ligne pour récupérer un cours par ID
router.post("/upload/:id", courseController.uploadImage);
router.put("/:id", courseController.updateCourse); // Ajoutez cette ligne pour mettre à jour un cours par ID

router.post("/sentiment/ai", courseController.Sentiment);

module.exports = router;
