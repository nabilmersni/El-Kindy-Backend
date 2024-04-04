const path = require("path");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Quiz = require("../models/Quiz");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const { findById } = require("mongoose").Types;
const newObjectId = new mongoose.Types.ObjectId();

async function createAnswer(quizId, questionId, answerText, isCorrect, image) {
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new Error("Le quiz avec cet ID n'existe pas.");
    }

    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("La question avec cet ID n'existe pas.");
    }

    const newAnswer = new Answer({
      answerText: answerText,
      isCorrect: isCorrect,
      image: image,
      question: new mongoose.Types.ObjectId(questionId),
    });

    const savedAnswer = await newAnswer.save();
    question.answers.push(savedAnswer._id);
    await question.save();

    return savedAnswer;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAnswers(req, res) {
  const { quizId, questionId } = req.params;
  try {
    const answers = await Answer.find({
      question: questionId,
    }).populate({
      path: "question",
      populate: {
        path: "quiz",
      },
    });
    return res.json(answers);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
}

async function getAnswerByIdAndQuestionId(answerId, questionId) {
  try {
    const answer = await Answer.findOne({
      _id: answerId,
      question: questionId,
    });
    if (!answer) {
      throw new Error("Réponse non trouvée pour l'ID spécifié.");
    }
    return answer;
  } catch (error) {
    throw new Error(error.message);
  }
}

const updateAnswer = async (req, res) => {
  const { questionId, answerId } = req.params;
  const { answerText, isCorrect } = req.body;
  const image = req.file;
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    const answer = await Answer.findOne({
      _id: answerId,
      question: questionId,
    });
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    answer.answerText = answerText;
    answer.isCorrect = isCorrect;

    if (image) {
      const imagePath = path.join(
        __dirname,
        "../public/upload-directory",
        image.filename
      );
      answer.image = image.filename;
      fs.renameSync(image.path, imagePath);
    }

    await answer.save();

    res.status(200).json({ message: "Answer updated successfully" });
  } catch (error) {
    console.error("Error updating answer:", error.message);
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
      const answer = await Answer.findById(id);
      if (!answer) {
        return res.status(404).json({ message: "Answer not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileName = req.file.filename;

      answer.image = fileName;

      await answer.save();

      res.json(answer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

async function deleteAnswer(req, res) {
  const { quizId, questionId, answerId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }
    const questionIndex = quiz.questions.findIndex(
      (q) => q.toString() === questionId
    );
    if (questionIndex === -1) {
      return res.status(404).json({ msg: "Question not found in quiz" });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }
    const answerIndex = question.answers.findIndex(
      (a) => a.toString() === answerId
    );
    if (answerIndex === -1) {
      return res.status(404).json({ msg: "Answer not found" });
    }
    question.answers.splice(answerIndex, 1);
    await question.save();
    await Answer.findByIdAndDelete(answerId);

    res.json({ msg: "Answer deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  createAnswer,
  getAnswers,
  updateAnswer,
  getAnswerByIdAndQuestionId,
  deleteAnswer,
  uploadImage,
};
