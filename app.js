const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//const clubRoutes = require("./routes/clubRoutes");
const quizRoutes = require("./routes/quizRoutes");
const eventRoute = require("./routes/EventRoute");
const AppError = require("./utils/appError");

// user routes
const userRouter = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const karaokeRoute = require("./routes/karaokeRoute");
// user routes

//course routes
const courseRoutes = require("./routes/courseRoutes.js");
const categoryRoutes = require("./routes/categoriesRoutes.js");
const subCategoryRoutes = require("./routes/subCategoriesRoutes.js");
const availabilitiesRoutes = require("./routes/availabilitiesRoutes.js");
const userAvailabilitiesRoutes = require("./routes/userAvailabilitiesRoutes.js");
const groupsRoutes = require("./routes/groupRoutes.js");
const groupAvailabilitiesRoutes = require("./routes/groupAvailabilitiesRoutes.js");
const reservationIndivRoutes = require("./routes/reservationIndivRoutes.js");
const studentTrackingSheetRoutes = require("./routes/studentTrackingSheetRoutes.js");

const classroomRoutes = require("./routes/classroomRoutes.js");
//end course routes

const app = express();

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`)); //for serving static files

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/quizs", quizRoutes);
app.use("/events", eventRoute);

//course
app.use("/courses", courseRoutes);
app.use("/categories", categoryRoutes);
app.use("/subCategories", subCategoryRoutes);
app.use("/availabilities", availabilitiesRoutes);
app.use("/userAvailabilities", userAvailabilitiesRoutes);
app.use("/groups", groupsRoutes);
app.use("/groupAvailabilities", groupAvailabilitiesRoutes);
app.use("/reservationIndiv", reservationIndivRoutes);
app.use("/studentTrackingSheetRoutes", studentTrackingSheetRoutes);

app.use("/classrooms", classroomRoutes);
//end course

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/karaoke", karaokeRoute);

/********chatgpt********/

const { PythonShell } = require("python-shell");

app.post("/chat", (req, res) => {
  const pythonScriptPath = "./chatgpt.py";
  const { message } = req.body;

  const options = {
    pythonOptions: ["-u"],
    scriptPath: "./",
    args: [message],
  };

  const pyShell = new PythonShell(pythonScriptPath, options);

  let response = "";

  pyShell.on("message", (msg) => {
    console.log("Message reçu du script Python:", msg);
    response += msg;
  });

  pyShell.end((err) => {
    if (err) {
      console.error("Erreur lors de l'exécution du script Python:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Exécution du script Python terminée.");
    return res.json({ response: response });
  });
});

module.exports = app;
