const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "config/config.env"),
});
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 5000;

// Add middleware
require("./middleware/middleware")(app);

// Add API Routes
app.use("/api", require("./routes/api"));

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).send("Up and running");
});

// Setup database connection
mongoose.connect(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(()=> {
    console.log("Database connected.");
    app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
}).catch((err) => {
    console.log(`Database connection error ${err.message}`);
});


