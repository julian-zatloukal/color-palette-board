const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "config/config.env"),
});
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.sendFile();
});

// app.use(express.static(path.join(__dirname, "../website")));

mongoose.connect(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(()=> {
    console.log("Database connected.");
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}).catch((err) => {
    console.log(`Database connection error ${err.message}`);
});


