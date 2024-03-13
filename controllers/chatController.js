const ChatModel = require("../models/chatModel.js");
const catchAsync = require("../utils/catchAsync.js");

exports.createChat = catchAsync(async (req, res, next) => {
  if (!req.body.senderId || !req.body.receiverId) {
    return res.status(404).json({
      status: "error",
      message: "the senderId and receiverId are required",
    });
  }

  const chat = await ChatModel.create({
    members: [req.body.senderId, req.body.receiverId],
  });

  res.status(200).json({
    status: "success",
    data: {
      chat,
    },
  });
});

exports.userChats = catchAsync(async (req, res, next) => {
  if (!req.params.userId) {
    return res.status(404).json({
      status: "error",
      message: "the userId is required",
    });
  }

  const chats = await ChatModel.find({
    members: { $in: [req.params.userId] },
  });

  res.status(200).json({
    status: "success",
    data: {
      chats,
    },
  });
});

exports.findChat = catchAsync(async (req, res, next) => {
  if (!req.body.firstId || !req.body.secondId) {
    return res.status(404).json({
      status: "error",
      message: "the firstId and secondId are required",
    });
  }

  const chat = await ChatModel.findOne({
    members: { $all: [req.params.firstId, req.params.secondId] },
  });

  res.status(200).json({
    status: "success",
    data: {
      chat,
    },
  });
});
