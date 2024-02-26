const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`)); //for serving static files

module.exports = app;
