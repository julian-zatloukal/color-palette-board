const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

module.exports = (app) => {
  console.log("Adding middleware");


  // CORS
  app.use(cors())

  // Body parser
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
      res.status(400).json({ status: "ERR", desc: "Request syntax error" });
    } else {
      next();
    }
  });

  // Logging
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }
};