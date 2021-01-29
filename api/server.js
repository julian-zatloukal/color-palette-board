const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "config/config.env"),
});
const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.sendFile();
});

// app.use(express.static(path.join(__dirname, "../website")));


app.listen(PORT, ( () => console.log(`Server started on port ${PORT}`)));