const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const LevelEnum = [
  "Initiation",
  "Preparatoire",
  "1er",
  "2eme",
  "3eme",
  "4eme",
  "5eme",
  "6eme",
  "Diplome",
  "1er Adulte",
  "2eme Adulte",
  "3eme Adulte",
];
var QuizSchema = new Schema({
  quizName: String,
  description: String,
  nbQuestions: Number,
  quizDuration: Number,

  level: {
    type: String,
    enum: LevelEnum,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "QuizUser",
    },
  ],
});

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
