const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
//const clubRoutes = require("./routes/clubRoutes");
const quizRoutes = require("./routes/quizRoutes");
const eventRoute = require("./routes/EventRoute");
const AppError = require("./utils/appError");

const courseRoutes = require("./routes/courseRoutes.js");
const categoryRoutes = require("./routes/categoriesRoutes.js");
const classroomRoutes = require("./routes/classroomRoutes.js");
const availableDatesRoutes = require("./routes/availableDates.js");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`)); //for serving static files

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/quizs", quizRoutes);
app.use("/events", eventRoute);
app.use("/courses", courseRoutes);
app.use("/categories", categoryRoutes);
app.use("/classrooms", classroomRoutes);
app.use("/availableDates", availableDatesRoutes);

module.exports = app;
