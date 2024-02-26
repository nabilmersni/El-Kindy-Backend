require("dotenv").config();
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

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
