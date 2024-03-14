const path = require("path");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const fs = require("fs");
const QuizSchema = require("../models/Quiz");

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
    // Supprimer la référence de la question dans le quiz
    quiz.questions.pull(questionId);
    await quiz.save();
    // Supprimer la question de la table Question
    await Question.findByIdAndDelete(questionId);
    return true; // Indique que la suppression a réussi
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
};
