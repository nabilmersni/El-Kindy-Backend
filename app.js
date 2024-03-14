const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
//const clubRoutes = require("./routes/clubRoutes");
const eventRoute = require("./routes/EventRoute")
const AppError = require("./utils/appError");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`)); 
app.use(cors());

app.use("/events", eventRoute);



module.exports = app;