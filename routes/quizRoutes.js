const express = require("express");
const router = express.Router();
const multer = require("multer");
const quizController = require("../controllers/QuizController");
const QuestionController = require("../controllers/QuestionController");
const answersCtrl = require("../controllers/AnswerController");
const answerController = require("../controllers/AnswerController");

const {
  createQuestionForQuiz,
  getQuestionById,
  getQuestionsForQuiz,
} = require("../controllers/QuestionController");
const QuizUser = require("../models/QuizUser");

// ****************CRUD_Quiz**********************

router.get("/users/:userId/quizzes/check", async (req, res) => {
  const userId = req.params.userId;

  try {
    const quizzes = await quizController.getQuizzesByUserIdcheck(userId);
    res.json(quizzes);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des quizs de l'utilisateur:",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la récupération des quizs de l'utilisateur",
    });
  }
});

router.get("/:userId/attestation", quizController.getUserQuizDetails);
router.get("/quiz/:quizId/starteduserscount", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const startedUsersCount = await QuizUser.countDocuments({
      quiz: quizId,
      isStarted: true,
    });
    const totalUsersCount = await QuizUser.countDocuments({ quiz: quizId });
    let percentage = 0;
    if (totalUsersCount > 0) {
      percentage = (startedUsersCount / totalUsersCount) * 100;
    }
    res.json({ percentage: percentage });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du pourcentage d'utilisateurs ayant commencé le quiz :",
      error
    );
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération du pourcentage d'utilisateurs ayant commencé le quiz.",
    });
  }
});

router.patch("/startQuiz/:userId/:quizId", quizController.QuizUserStarted);
router.get("/getall", quizController.getAllQuizs);
router.get("/:id", quizController.getQuizById);
router.post("/add", quizController.createQuiz);
router.put("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);
router.post("/:quizId/assign", quizController.assignUserToQuiz);
router.get("/:quizId/users", quizController.getUsers);
router.put("/:userId/:quizId/startquiz", async (req, res) => {
  const { userId, quizId } = req.params;
  const { isStarted } = req.body;
  try {
    const updatedQuizUser = await quizController.updateIsStarted(
      userId,
      quizId,
      isStarted
    );
    res.json(updatedQuizUser);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur s'est produite lors de la mise à jour de isStarted.",
    });
  }
});
router.get("/:userId/started", async (req, res) => {
  const { userId } = req.params;

  try {
    const startedQuizzes = await quizController.getStartedQuizzesByUserId(
      userId
    );
    res.json(startedQuizzes);
  } catch (error) {
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la récupération des quiz démarrés.",
    });
  }
});
router.get("/quizzes/:userId", quizController.getQuizzesByUserId);

router.get(
  "/:userId/:quizId/questionsandanswers",
  quizController.getQuizWithQuestionsAndAnswers
);
router.post("/scores", async (req, res) => {
  try {
    const { userId, quizId, score } = req.body;

    const existingQuizUser = await QuizUser.findOneAndUpdate(
      { user: userId, quiz: quizId },
      { score: score },
      { new: true }
    );

    if (!existingQuizUser) {
      const newQuizUser = new QuizUser({
        user: userId,
        quiz: quizId,
        score: score,
      });
      await newQuizUser.save();
    }
    res.status(201).json({ message: "Score enregistré avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du score :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'enregistrement du score" });
  }
});
router.delete(
  "/quizzes/:quizId/users/:userId",
  quizController.removeUserFromQuiz
);
router.get("/:userId/:quizId/quizuser", quizController.getQuizUser);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload-directory");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post("/:id/questions", upload.single("image"), (req, res) => {
  if (req.file) {
    createQuestionForQuiz(
      req.params.id,
      req.body.questionText,
      req.body.nbPoint,
      req.file.filename,
      res
    );
  } else {
    createQuestionForQuiz(
      req.params.id,
      req.body.questionText,
      req.body.nbPoint,
      "",
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
router.post("/:id/image", QuestionController.uploadImage);
router.put(
  "/:quizId/questions/:questionId",
  upload.single("image"),
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

router.post(
  "/:quizId/questions/:questionId",
  upload.single("image"),
  async (req, res) => {
    const { quizId, questionId } = req.params;
    const { answerText, isCorrect } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
      const answer = await answerController.createAnswer(
        quizId,
        questionId,
        answerText,
        isCorrect,
        image
      );

      res.status(201).json(answer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

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

router.post("/:id/image", answersCtrl.uploadImage);
router.put(
  "/:questionId/answers/:answerId",
  upload.single("image"),
  answerController.updateAnswer
);

router.delete(
  "/:quizId/questions/:questionId/answers/:answerId",
  answerController.deleteAnswer
);

module.exports = router;
