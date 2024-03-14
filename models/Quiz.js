const Question = require("./Question");
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var QuizSchema = new Schema({
  quizName: String,
  description: String,
  nbQuestions: Number,
  quizDuration: Number,
  quizStartDate: Date,
  quizEndDate: Date,
  level: String,
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

QuizSchema.methods.getUsers = async function () {
  console.log("IDs to search:", this.users);
  return await mongoose.connection.collection("users").find({
    _id: { $in: this.users },
  });
};
const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
