const express = require("express");
const router = express.Router();
const multer = require("multer");
const quizController = require("../controllers/QuizController");
const QuestionController = require("../controllers/QuestionController");
const answersCtrl = require("../controllers/AnswerController");
const answerController = require("../controllers/AnswerController");
const { updateAnswer } = require("../controllers/AnswerController");
const Quiz = require("../models/Quiz");
const {
  createQuestionForQuiz,
  getQuestionById,
  getQuestionsForQuiz,
} = require("../controllers/QuestionController");

// ****************CRUD_Quiz**********************
router.get("/getall", quizController.getAllQuizs);
router.get("/:id", quizController.getQuizById);
router.post("/add", quizController.createQuiz);
router.put("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);
router.post("/:quizId/assign", quizController.assignUserToQuiz);
router.get("/:id/users", quizController.getUsers);

// ****************CRUD_Question**********************

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload-directory");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// Créez un middleware Multer en spécifiant la configuration de stockage
const upload = multer({ storage: storage });
router.post("/:id/questions", upload.single("image"), (req, res) => {
  // Vérifiez si req.file est défini
  if (req.file) {
    // Si un fichier a été téléchargé, utilisez son nom de fichier
    createQuestionForQuiz(
      req.params.id,
      req.body.questionText,
      req.body.nbPoint,
      req.file.filename,
      res
    );
  } else {
    // Si aucun fichier n'a été téléchargé, appelez createQuestionForQuiz avec une chaîne vide pour l'image
    createQuestionForQuiz(
      req.params.id,
      req.body.questionText,
      req.body.nbPoint,
      "", // Utilisez une chaîne vide pour l'image
      res
    );
  }
});

router.get("/:quizId/questions", (req, res) => {
  getQuestionsForQuiz(req.params.quizId, res);
});

router.get("/:quizId/questions/:questionId", async (req, res) => {
  const question = await getQuestionById(
    req.params.quizId,
    req.params.questionId
  );
  res.json(question);
});

router.put(
  "/:quizId/questions/:questionId",
  upload.single("image"), // Middleware pour gérer le fichier image
  QuestionController.updateQuestionInQuiz
);

router.delete("/:quizId/questions/:questionId", async (req, res) => {
  const { quizId, questionId } = req.params;

  try {
    await QuestionController.deleteQuestionById(quizId, questionId);
    res
      .status(200)
      .json({ message: "Question deleted from quiz successfully" });
  } catch (error) {
    console.error("Error deleting question from quiz:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ****************CRUD_Answer**********************

router.post("/:quizId/questions/:questionId", async (req, res) => {
  const { quizId, questionId } = req.params;
  const { answerText, isCorrect } = req.body;

  try {
    const answer = await answerController.createAnswer(
      quizId,
      questionId,
      answerText,
      isCorrect
    );
    res.status(201).json(answer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:quizId/questions/:questionId/answers", answersCtrl.getAnswers);

router.get("/:questionId/answers/:answerId", async (req, res) => {
  const { questionId, answerId } = req.params;

  try {
    const answer = await answerController.getAnswerByIdAndQuestionId(
      answerId,
      questionId
    );
    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/:questionId/answers/:answerId", async (req, res) => {
  const { questionId, answerId } = req.params;
  const { answerText, isCorrect } = req.body; // Attendre les champs spécifiques de la réponse
  const updatedData = { answerText, isCorrect }; // Créer un objet contenant les données mises à jour
  try {
    const result = await updateAnswer(questionId, answerId, updatedData);
    if (result.success) {
      return res.status(200).json({ success: true, message: result.message });
    } else {
      return res.status(404).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la réponse :", error);
    return res.status(500).json({
      success: false,
      message:
        "Une erreur s'est produite lors de la mise à jour de la réponse.",
    });
  }
});

router.delete(
  "/:quizId/questions/:questionId/answers/:answerId",
  answerController.deleteAnswer
);

module.exports = router;
