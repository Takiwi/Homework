const express = require("express");
const app = express();
const GenerateKey = require("./utils/generateKey");
require("dotenv").config();

// config
GenerateKey.generateKeyPair();

// init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init databases
require("./db/mongodb.connection");

// init routes
app.use("/", require("./routes/index"));

// init handler error
app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error!",
  });
});

module.exports = app;
