const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, async (req, res) => {
  try {
    let post = await Post.findOne({ shortUUID: req.body.shortUUID }).exec();
    if (!post) throw new Error("Post not found");

    let user = await User.findOne({
      username: jwt.decode(req.token).username,
    }).exec();
    if (!user) throw new Error("User not found");

    if (req.body.action === "like") {
      if (post.likesInfo.users.includes(user._id))
        throw new Error("User already liked the post");
      post.likesInfo.users.push(user._id);
      post.likesInfo.count = post.likesInfo.count + 1;
    } else {
      if (!post.likesInfo.users.includes(user._id))
        throw new Error("User didn't like the post");
      post.likesInfo.users.splice(post.likesInfo.users.indexOf(user._id), 1);
      post.likesInfo.count = post.likesInfo.count - 1;
    }

    await post.save();
    res.status(200).json({ status: "OK" });
  } catch (err) {
    res.status(200).json({
      status: "ERR",
      desc: `Error liking the post: ${err.message}`,
    });
  }
});

module.exports = router;
