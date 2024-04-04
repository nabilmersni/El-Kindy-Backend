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
    members: [{ user: req.body.senderId }, { user: req.body.receiverId }],
  });

  res.status(200).json({
    status: "success",
    data: {
      chat,
    },
  });
});

// exports.userChats = catchAsync(async (req, res, next) => {
//   if (!req.params.userId) {
//     return res.status(404).json({
//       status: "error",
//       message: "the userId is required",
//     });
//   }

//   const chats = await ChatModel.find({
//     "members.user": req.params.userId,
//   }).sort({ updatedAt: -1 });

//   res.status(200).json({
//     status: "success",
//     data: {
//       chats,
//     },
//   });
// });

exports.userChats = catchAsync(async (req, res, next) => {
  if (!req.params.userId) {
    return res.status(404).json({
      status: "error",
      message: "The userId is required",
    });
  }

  const userId = new mongoose.Types.ObjectId(req.params.userId);

  const chats = await ChatModel.aggregate([
    {
      $match: {
        "members.user": userId,
      },
    },
    {
      $lookup: {
        from: "messages",
        let: { chatId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$chatId", { $toString: "$$chatId" }] }, // Convert ObjectId to String for comparison
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 1,
          },
        ],
        as: "lastMessage",
      },
    },
    {
      $addFields: {
        lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
      },
    },
    {
      $sort: { "lastMessage.createdAt": -1 },
    },
  ]);

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
    $and: [
      { "members.user": req.params.firstId },
      { "members.user": req.params.secondId },
    ],
  });

  res.status(200).json({
    status: "success",
    data: {
      chat,
    },
  });
});

exports.updateChatSeen = catchAsync(async (req, res, next) => {
  if (!req.params.userId || !req.body.chatId) {
    return res.status(400).json({
      status: "error",
      message: "Both userId and chatId are required.",
    });
  }

  const userId = req.params.userId;
  const chatId = req.body.chatId;
  const seen = req.body.seen;

  // Find the chat
  const chat = await ChatModel.findOne({ _id: chatId });

  if (!chat) {
    return res.status(404).json({
      status: "error",
      message: "Chat not found.",
    });
  }

  // Find the index of the current user in the members array
  const userIndex = chat.members.findIndex((member) => member.user == userId);
  if (userIndex !== -1) {
    // Update the seen state for the current user
    chat.members[userIndex].seen = seen;
    chat.updatedAt = Date.now();
    await chat.save();

    return res.status(200).json({
      status: "success",
      message: "Seen state updated successfully.",
      chat,
    });
  } else {
    return res.status(404).json({
      status: "error",
      message: "User not found in the chat.",
    });
  }
});
const mongoose = require("mongoose");

exports.countUnseenChats = catchAsync(async (req, res, next) => {
  if (!req.params.userId) {
    return res.status(400).json({
      status: "error",
      message: "The userId is required.",
    });
  }

  const userId = req.params.userId;
  const userIdObject = new mongoose.Types.ObjectId(userId);

  const count = await ChatModel.aggregate([
    {
      $unwind: "$members",
    },
    {
      $match: {
        "members.user": userIdObject,
        "members.seen": false,
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]);

  const unseenChatsCount = count.length > 0 ? count[0].count : 0;

  res.status(200).json({
    status: "success",
    data: {
      unseenChatsCount,
    },
  });
});
