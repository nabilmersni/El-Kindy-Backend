const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var AnswerSchema = new Schema({
  answerText: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
});
const Answer = mongoose.model("Answer", AnswerSchema);
module.exports = Answer;
