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
// user routes

const courseRoutes = require("./routes/courseRoutes.js");
const categoryRoutes = require("./routes/categoriesRoutes.js");
const classroomRoutes = require("./routes/classroomRoutes.js");
const availableDatesRoutes = require("./routes/availableDates.js");

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
app.use("/courses", courseRoutes);
app.use("/categories", categoryRoutes);
app.use("/classrooms", classroomRoutes);
app.use("/availableDates", availableDatesRoutes);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRoute);
app.use("/api/v1/messages", messageRoute);

module.exports = app;
