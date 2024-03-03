const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const { required } = require("nodemon/lib/config");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`)); //for serving static files

app.use("/api/v1/users", userRouter);

module.exports = app;
