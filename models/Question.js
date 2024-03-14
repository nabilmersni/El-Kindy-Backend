const mongoose = require("mongoose");
const Quiz = require("./Quiz");
var Schema = mongoose.Schema;
var QuestionsSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  nbPoint: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],

  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
});
const Question = mongoose.model("Question", QuestionsSchema);
module.exports = Question;
