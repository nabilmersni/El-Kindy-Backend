const mongoose = require("mongoose");

const ChatMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  seen: {
    type: Boolean,
    default: true,
  },
});

const ChatSchema = new mongoose.Schema(
  {
    members: [ChatMemberSchema],
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("Chat", ChatSchema);

module.exports = ChatModel;
