const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");

router.post("/", async (req, res) => {
  try {
    let post = await Post.findOne({ shortUUID: req.body.shortUUID }).lean().exec();
    if (!post) throw new Error("Post not found");

    let user = await User.findById(post.userId).exec();
    if (!user) throw new Error("User not found");

    res
      .status(200)
      .json({
        status: "OK",
        data: {
          ...post,
          author: { username: user.username, profilePicure: "" },
        },
      });
  } catch (err) {
    res.status(200).json({
      status: "ERR",
      desc: `Error retrieving post ${err.message}`,
    });
  }
});

module.exports = router;
