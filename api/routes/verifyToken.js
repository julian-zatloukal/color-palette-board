const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, async (req, res) => {
  try {
    let payload = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    if (payload) {
      res.status(200).json({ status: "OK", data: payload });
    }
  } catch (ex) {
    res.status(200).json({ status: "ERR", desc: ex.message });
  }
});

module.exports = router;
