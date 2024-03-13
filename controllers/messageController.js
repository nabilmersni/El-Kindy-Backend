const MessageModel = require("../models/messageModel.js");
const catchAsync = require("../utils/catchAsync.js");

exports.addMessage = catchAsync(async (req, res, next) => {
  const { chatId, senderId, text } = req.body;

  const message = await MessageModel.create({
    chatId,
    senderId,
    text,
  });

  res.status(200).json({
    status: "success",
    data: {
      message,
    },
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const { chatId } = req.params;
  const messages = await MessageModel.find({ chatId });

  res.status(200).json({
    status: "success",
    data: {
      messages,
    },
  });
});
