const path = require("path");
const Quiz = require("../models/Quiz");
const mongoose = require("mongoose");
const QuizUser = require("../models/QuizUser");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const User = require("../models/userModel");

exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllQuizs = async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};
    if (name) {
      query = { nom: { $regex: new RegExp(name, "i") } };
    }
    const quizs = await Quiz.find(query);
    res.json(quizs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateQuiz = async (req, res) => {
  const id = req.params.id;
  try {
    const quiz = await Quiz.findByIdAndUpdate(id, req.body, { new: true });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await Question.deleteMany({ _id: { $in: quiz.questions } });

    await Answer.deleteMany({ question: { $in: quiz.questions } });

    await QuizUser.deleteMany({ quiz: id });

    const deletedQuiz = await Quiz.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Quiz deleted successfully", quiz: deletedQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

///******************* ****************************************/

exports.assignUserToQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { email } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz non trouvé" });
    }

    const usersCollection = mongoose.connection.collection("users");
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const quizUser = new QuizUser({
      user: user._id,
      quiz: quiz._id,
    });
    await quizUser.save();

    quiz.users.push(user._id);
    await quiz.save();

    return res.status(200).json({
      status: "success",
      message: "Utilisateur attribué avec succès au quiz",
      user,
      quiz,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erreur lors de l'attribution de l'utilisateur au quiz" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quizUsers = await QuizUser.find({ quiz: quizId });

    const userIds = quizUsers.map((quizUser) => quizUser.user);
    const users = await mongoose.connection
      .collection("users")
      .find({ _id: { $in: userIds } })
      .toArray();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erreur lors de la récupération des utilisateurs par ID de quiz",
    });
  }
};
exports.updateIsStarted = async (userId, quizId, isStarted) => {
  try {
    const updatedQuizUser = await QuizUser.findOneAndUpdate(
      { user: userId, quiz: quizId },
      { $set: { isStarted: isStarted } }
    );

    return updatedQuizUser;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de isStarted:", error);
    throw error;
  }
};

exports.getStartedQuizzesByUserId = async (userId) => {
  try {
    const startedQuizzes = await QuizUser.find({
      user: userId,
      isStarted: true,
    }).populate("quiz");
    return startedQuizzes;
  } catch (error) {
    console.error("Erreur lors de la récupération des quiz démarrés:", error);
    throw error;
  }
};

exports.getQuizzesByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const quizzes = await QuizUser.getQuizzesByUserId(userId);
    res.json(quizzes);
  } catch (error) {
    console.error("Erreur lors de la récupération des quiz :", error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des quiz.",
    });
  }
};

//********************************************************** */

exports.getQuizWithQuestionsAndAnswers = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const quizId = req.params.quizId;

    const quizUser = await QuizUser.findOne({ user: userId, quiz: quizId });
    if (!quizUser) {
      return res.status(404).json({ message: "Quiz not found for this user" });
    }

    const quiz = await Quiz.findById(quizId).populate({
      path: "questions",
      populate: {
        path: "answers",
      },
    });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeUserFromQuiz = async (req, res) => {
  const { userId, quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.users = quiz.users.filter(
      (user) => user.toString() !== userId.toString()
    );
    await quiz.save();

    await QuizUser.deleteOne({ user: userId, quiz: quizId });

    res.json({ message: "User removed from quiz successfully" });
  } catch (error) {
    console.error("Error removing user from quiz:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getQuizUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const quizId = req.params.quizId;

    const quizUser = await QuizUser.findOne({ user: userId, quiz: quizId });
    if (!quizUser) {
      return res.status(404).json({ message: "quiz user not found" });
    }
    res.json(quizUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.QuizUserStarted = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const quizId = req.params.quizId;

    const quizUser = await QuizUser.findOneAndUpdate(
      { user: userId, quiz: quizId },
      { $set: { isCompleted: true } },
      { new: true }
    );
    if (!quizUser) {
      return res.status(404).json({ message: "quiz user not found" });
    }
    res.json(quizUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserQuizDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }
    const quizzes = await QuizUser.find({
      user: userId,
      isCompleted: true,
    }).populate("quiz");
    const quizDetails = quizzes.map((quizUser) => ({
      level: quizUser.quiz.level,
      score: quizUser.score,
    }));
    res.json({
      fullName: user.fullname,
      quizDetails: quizDetails,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuizzesByUserIdcheck = async (userId) => {
  const quizzes = await QuizUser.find({ user: userId, isCompleted: true });
  return quizzes;
};
