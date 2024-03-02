const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`)); //for serving static files

app.use("/api/v1/users", userRouter);

module.exports = app;
