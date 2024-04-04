const express = require("express");
const karaokeController = require("../controllers/karaokeController");
const multer = require("multer");

const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/mp3"); // Set your upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/audioYt", karaokeController.extractAudioFromYt);

router.post(
  "/mixAudio",
  upload.single("audioFile"),
  karaokeController.mixAudio
);
// router.post("/removeVoiceAudio", karaokeController.removeVoiceAudio);

module.exports = router;
