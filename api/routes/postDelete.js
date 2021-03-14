const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const verifyToken = require("../middleware/verifyToken");
const crypto = require("crypto");
const base64url = require("base64url");

// @desc    Delete post
// @route   POST /posts/delete
// @params  shortUuid
router.post("/", verifyToken, async (req, res) => {
  try {
    let user = await User.findOne({
      username: jwt.decode(req.token).username,
    }).exec();

    if (!user) {
      throw Error("User not found.");
    }

    let post = await Post.findOne({ shortUUID: req.body.shortUUID }).exec();
    if (post.length === 0) {
      throw Error("Post not found.");
    } else if (post.userId !== user.id) {
      throw Error("User didn't author the post.");
    } else {
      await Post.deleteOne({ shortUUID: req.body.shortUUID }).exec();
    }

    res.status(200).json({ status: "OK" });
  } catch (err) {
    res.status(200).json({
      status: "ERR",
      desc: `Error deleting post: ${err.message}`,
    });
  }
});

module.exports = router;
