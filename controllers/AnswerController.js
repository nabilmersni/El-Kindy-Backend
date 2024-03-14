const path = require("path");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Quiz = require("../models/Quiz");
const mongoose = require("mongoose");
const { findById } = require("mongoose").Types;
const newObjectId = new mongoose.Types.ObjectId();
async function createAnswer(quizId, questionId, answerText, isCorrect) {
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

// const deleteAnswer = async (quizId, questionId, answerId) => {
//   try {
//     // Supprimer la réponse de la base de données
//     const deletedAnswer = await Answer.findByIdAndDelete(answerId);
//     if (!deletedAnswer) {
//       throw new Error("La réponse spécifiée n'a pas été trouvée.");
//     }

//     // Mettre à jour la question pour supprimer l'ID de la réponse de sa liste de réponses
//     const updatedQuestion = await Question.findByIdAndUpdate(
//       questionId,
//       { $pull: { answers: answerId } }, // Supprime l'ID de la réponse de la liste des réponses associées à la question
//       { new: true } // Retourne la question mise à jour après la modification
//     );

//     // Vérifiez si la question a été mise à jour avec succès
//     if (!updatedQuestion) {
//       throw new Error("La question spécifiée n'a pas été trouvée.");
//     }

//     return updatedQuestion;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

async function updateAnswer(questionId, answerId, updatedData) {
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return { success: false, message: "La question n'existe pas." };
    }
    const answer = await Answer.findOne({
      _id: answerId,
      question: questionId,
    });
    if (!answer) {
      return {
        success: false,
        message:
          "La réponse n'existe pas ou n'appartient pas à cette question.",
      };
    }
    await Answer.findByIdAndUpdate(answerId, updatedData);

    return {
      success: true,
      message: "La réponse a été mise à jour avec succès.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        "Une erreur s'est produite lors de la mise à jour de la réponse.",
    };
  }
}

async function deleteAnswer(req, res) {
  const { quizId, questionId, answerId } = req.params;

  try {
    // Récupérer le quiz
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    // Trouver l'index de la question dans le tableau quiz.questions
    const questionIndex = quiz.questions.findIndex(
      (q) => q.toString() === questionId
    );

    // Vérifier si la question existe dans le quiz
    if (questionIndex === -1) {
      return res.status(404).json({ msg: "Question not found in quiz" });
    }

    // Charger la question à partir de sa référence ObjectId
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    // Trouver et supprimer la réponse
    const answerIndex = question.answers.findIndex(
      (a) => a.toString() === answerId
    );
    if (answerIndex === -1) {
      return res.status(404).json({ msg: "Answer not found" });
    }

    // Supprimer la réponse de la liste des réponses de la question
    question.answers.splice(answerIndex, 1);

    // Enregistrer les modifications apportées à la question
    await question.save();

    // Supprimer la réponse de la base de données
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
};
