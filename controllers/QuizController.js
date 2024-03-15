const path = require("path");
const Quiz = require("../models/Quiz");
const mongoose = require("mongoose");
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
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
    quiz.users.push(user._id);
    await quiz.save();
    // return res
    //   .status(200)
    //   .json({ message: "Utilisateur attribué avec succès au quiz" });

    return res.status(200).json({
      status: "success",
      message: "Utilisateur attribué avec succès au quiz",
      user,
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
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    const usersCursor = await quiz.getUsers();
    const users = await usersCursor.toArray();
    console.log("Users:", users);
    res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
