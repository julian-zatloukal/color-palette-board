const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");

router.get("/", async (req, res) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      req.token = bearerHeader.split(" ")[1];
    }

    let posts = await Post.find().sort({ createdAt: -1 }).lean().exec();

    posts = await Promise.all(
      posts.map(async (post) => {
        let user = await User.findById(post.userId).exec();

        if (req.token) {
          return {
            ...post,
            author: { username: user.username, profilePicure: "" },
            userLiked: post.likesInfo.users.includes(
              String(
                (
                  await User.findOne({
                    username: jwt.decode(req.token).username,
                  })
                )._id
              )
            ),
          };
        } else {
          return {
            ...post,
            author: { username: user.username, profilePicure: "" },
          };
        }
      })
    );

    res.status(200).json({ status: "OK", data: posts });
  } catch (err) {
    res.status(200).json({
      status: "ERR",
      desc: `Error retrieving all posts ${err.message}`,
    });
  }
});

module.exports = router;
