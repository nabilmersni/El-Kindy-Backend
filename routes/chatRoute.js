const express = require("express");
const chatController = require("../controllers/chatController");

const router = express.Router();

router.post("/", chatController.createChat);
router.get("/:userId", chatController.userChats);
router.get("/find/:firstId/:secondId", chatController.findChat);
router.patch("/:userId", chatController.updateChatSeen);
router.get("/stat/unseen/:userId", chatController.countUnseenChats);

module.exports = router;
