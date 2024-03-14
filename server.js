require("dotenv").config();
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const cors = require("cors");
const app = require("./app");

// Activer CORS pour toutes les routes
app.use(cors());

const courseRoutes = require("./routes/courseRoutes.js");
app.use("/courses", courseRoutes);

const categoryRoutes = require("./routes/categoriesRoutes.js");
app.use("/categories", categoryRoutes);

const classroomRoutes = require("./routes/classroomRoutes.js");
app.use("/classrooms", classroomRoutes);

const availableDatesRoutes = require("./routes/availableDates.js");
app.use("/availableDates", availableDatesRoutes);

const DB = process.env.DB_URL;
mongoose.connect(DB).then((con) => {
  console.log("Db connection succesfully");
});
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`server listen on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
