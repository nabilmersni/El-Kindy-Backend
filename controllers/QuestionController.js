const path = require("path");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const fs = require("fs");
const multer = require("multer");
const QuizSchema = require("../models/Quiz");
const Answer = require("../models/Answer");

async function createQuestionForQuiz(_id, questionText, nbPoint, image, res) {
  try {
    const quiz = await Quiz.findById(_id);
    const newQuestion = new Question({
      questionText: questionText,
      nbPoint: nbPoint,
      image: image || "",
    });
    const savedQuestion = await newQuestion.save();
    quiz.questions.push(savedQuestion._id);
    await quiz.save();
    res.status(201).json({
      message: "Question créée et affectée au quiz !",
      question: savedQuestion,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getQuestionsForQuiz(quizId, res) {
  try {
    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }
    const questions = quiz.questions;
    return res.status(200).json({
      questions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

//******************************** */

const updateQuestionInQuiz = async (req, res) => {
  const { quizId, questionId } = req.params;
  const { questionText, nbPoint } = req.body;
  const image = req.file;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const questionIndex = quiz.questions.findIndex((q) => q.equals(questionId));
    if (questionIndex === -1) {
      return res.status(404).json({ message: "Question not found in quiz" });
    }
    quiz.questions[questionIndex].questionText = questionText;
    quiz.questions[questionIndex].nbPoint = nbPoint;
    if (image) {
      const imagePath = path.join(
        __dirname,
        "../upload-directory",
        image.filename
      );
      quiz.questions[questionIndex].image = image.filename;
      fs.renameSync(image.path, imagePath);
    }
    await quiz.save();
    const updatedImageData = image ? image.filename : null;
    await Question.findByIdAndUpdate(questionId, {
      questionText,
      nbPoint,
      image: updatedImageData || req.body.oldImage,
    });
    res.status(200).json({ message: "Question updated in quiz successfully" });
  } catch (error) {
    console.error("Error updating question in quiz:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload-directory");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image"
);

const uploadImage = async (req, res) => {
  const { id } = req.params;

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      const question = await Question.findById(id);
      if (!question) {
        return res.status(404).json({ message: "Course not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const fileName = req.file.filename;
      question.image = fileName;

      await question.save();

      res.json(question);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

const getQuestionById = async (quizId, questionId) => {
  try {
    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    const question = quiz.questions.find((q) => q._id.equals(questionId));
    if (!question) {
      throw new Error("Question not found");
    }
    return question;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteQuestionFromQuiz = async (req, res) => {
  const { quizId, questionId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const result = await quiz.deleteQuestionById(questionId);
    if (!result) {
      return res.status(404).json({ message: "Question not found in quiz" });
    }
    res
      .status(200)
      .json({ message: "Question deleted from quiz successfully" });
  } catch (error) {
    console.error("Error deleting question from quiz:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteQuestionById = async function (quizId, questionId) {
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    quiz.questions.pull(questionId);
    await quiz.save();
    await Answer.deleteMany({ question: questionId });
    await Question.findByIdAndDelete(questionId);

    return true;
  } catch (error) {
    console.error("Error deleting question:", error.message);
    throw new Error("Error deleting question");
  }
};

module.exports = {
  deleteQuestionById,
  deleteQuestionFromQuiz,
  createQuestionForQuiz,
  getQuestionsForQuiz,
  getQuestionById,
  updateQuestionInQuiz,
  uploadImage,
};
