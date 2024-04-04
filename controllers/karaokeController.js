const catchAsync = require("./../utils/catchAsync");
const ytdl = require("ytdl-core");
const ffmpegPath = require("ffmpeg-static");
const { spawnSync } = require("child_process");

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

exports.extractAudioFromYt = catchAsync(async (req, res, next) => {
  if (!req.query.url) {
    return res.status(400).json({
      status: "error",
      message: "Youtube url is required",
    });
  }

  const videoUrl = req.query.url;
  const videoInfo = await ytdl.getInfo(videoUrl);
  const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");
  console.log(audioFormats);
  audioFormats.map((item) => {
    res.status(200).json({
      status: "success",
      data: {
        audioUrl: item.url,
      },
    });
  });
});

const unlinkFile = async (filePath) => {
  try {
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      await unlinkAsync(filePath);
      console.log(`File ${filePath} has been deleted successfully.`);
    } else {
      console.log(`File ${filePath} does not exist.`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}: ${error.message}`);
  }
};

exports.removeVoiceAudio = async (audioUrl) => {
  // const RapidAPIKey = "9224db0facmshefac6bb3b4c8002p1c641cjsn90b0d08dc1d3";
  const RapidAPIKey = "4b066acb03msh7deea4abd1a5280p1a9200jsn271842d73317";
  const filePath = `./public/mp3/${(Math.random() + 1)
    .toString(36)
    .substring(2)}.mp3`;
  try {
    const result = spawnSync(ffmpegPath, [
      "-i",
      audioUrl,
      "-vn", // Disable video recording
      "-acodec",
      "libmp3lame", // Specify the MP3 codec
      "-f",
      "mp3",
      filePath,
    ]);

    console.log("Conversion successful");
    console.log("Audio file saved:", filePath);

    // Step 1: Upload the file using the first endpoint
    const uploadFormData = new FormData();
    uploadFormData.append("fileName", fs.createReadStream(filePath));

    const uploadOptions = {
      method: "POST",
      url: "https://vocal-remover.p.rapidapi.com/api/v2/FileUpload",
      headers: {
        "X-RapidAPI-Key": RapidAPIKey,
        "X-RapidAPI-Host": "vocal-remover.p.rapidapi.com",
        ...uploadFormData.getHeaders(),
      },
      data: uploadFormData,
    };

    const uploadResponse = await axios.request(uploadOptions);
    const fileName = uploadResponse.data.file_name;

    // Step 2: Process the file using the second endpoint
    const processParams = new URLSearchParams();
    processParams.set("file_name", fileName);

    const processOptions = {
      method: "POST",
      url: "https://vocal-remover.p.rapidapi.com/api/v2/ProcessFile",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": RapidAPIKey,
        "X-RapidAPI-Host": "vocal-remover.p.rapidapi.com",
      },
      data: processParams,
    };

    const processResponse = await axios.request(processOptions);
    const vocalRemovedLink = processResponse.data.instrumental_path;

    //Clean up the uploaded file
    await unlinkFile(filePath);

    return vocalRemovedLink;

    // res.status(200).json({
    //   status: "success",
    //   vocalRemovedLink: vocalRemovedLink,
    // });
  } catch (error) {
    console.error("Error:", error);
    //Clean up the uploaded file
    await unlinkFile(filePath);
  }
};

exports.mixAudio = async (req, res, next) => {
  const file = req.file;
  const musicAudioUrl = req.body.musicAudioUrl;

  const timestamp = new Date().getTime();

  const audio1Path = `./public/mp3/${file.originalname}`;
  const audio2Path = await this.removeVoiceAudio(musicAudioUrl);
  const outputFilePath = `./public/mp3/${timestamp}.mp3`;

  try {
    const mixCmd = [
      "-i",
      audio1Path,
      "-i",
      audio2Path,
      "-filter_complex",
      "[0:a]volume=1[a];[1:a]volume=0.3[b];[a][b]amix=inputs=2:duration=first:dropout_transition=2[aout]",
      "-map",
      "[aout]",
      outputFilePath,
    ];

    const mixCmdResult = spawnSync(ffmpegPath, mixCmd);

    if (mixCmdResult.error) {
      throw mixCmdResult.error;
    }
    console.log(`Mixed audio saved to: ${outputFilePath}`);

    const data = await fs.promises.readFile(outputFilePath);
    const blob = Buffer.from(data).toString("base64");

    // const audioUrl = await uploadAndGenerateUrl(outputFilePath);
    // console.log("audioUrl: ", audioUrl);

    res.status(200).json({
      status: "success",
      message: "Mixed audio saved successfully.",
      data: {
        // audioUrl,
        mixedAudioBlob: blob,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while processing your cover.",
    });
  }

  // Clean up temporary files
  await unlinkFile(audio1Path);
  await unlinkFile(outputFilePath);
};
