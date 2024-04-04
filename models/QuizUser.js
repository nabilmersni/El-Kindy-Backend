const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Quiz = require("./Quiz");
const QuizUserSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  quiz: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
  },
  isStarted: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    // required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});
QuizUserSchema.statics.getQuizzesByUserId = async function (userId) {
  try {
    const quizzes = await this.find({ user: userId }).populate("quiz");
    return quizzes;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des quizzes par l'ID de l'utilisateur"
    );
  }
};

const QuizUser = mongoose.model("QuizUser", QuizUserSchema);

module.exports = QuizUser;
