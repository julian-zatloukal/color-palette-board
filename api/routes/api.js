const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const base64url = require("base64url");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Post = require("../models/Post");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    req.token = bearerHeader.split(" ")[1];
    next();
  } else {
    res.sendStatus(403);
  }
};

// @desc    API root endpoint
// @route   GET /api/
router.get("/", (req, res) => {
  res.status(200).send("Up and running API");
});

// @desc    Register user
// @route   POST /users/register
router.post("/users/register", async (req, res) => {
  try {
    // input verification

    if (await User.findOne({ username: req.body.username }).exec()) {
      return res.status(200).json({
        status: "ERR",
        desc: `Username already exists`,
      });
    }

    if (await User.findOne({ email: req.body.email }).exec()) {
      return res.status(200).json({
        status: "ERR",
        desc: `Email already exists`,
      });
    }

    var newUser = new User({
      username: req.body.username,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
    });

    await newUser.save();

    res.status(200).json({ status: "OK" });
  } catch (err) {
    res.status(200).json({
      status: "ERR",
      desc: `Error uploading user to db ${err.message}`,
    });
  }
});

// @desc    Create post
// @route   POST /posts/create
// @params  token, palette
router.post("/posts/create", verifyToken, async (req, res) => {
  try {
    if (!req.token) {
      return res.status(200).json({
        status: "ERR",
        desc: `Token not found`,
      });
    }

    let user = await User.findOne({
      username: jwt.decode(req.token).username,
    }).exec();

    if (!user) {
      return res.status(200).json({
        status: "ERR",
        desc: `Username not found`,
      });
    }

    let uuid = await new Promise((resolve, reject) => {
      crypto.randomBytes(8, function (ex, buffer) {
        if (ex) {
          reject("error generating uuid");
        } else {
          resolve(base64url(buffer));
        }
      });
    });

    var newPost = new Post({
      userId: user._id,
      shortUUID: uuid,
      palette: req.body.palette,
    });

    await newPost.save();

    res.status(200).json({ status: "OK" });
  } catch (err) {
    res.status(200).json({
      status: "ERR",
      desc: `Error uploading post to db ${err.message}`,
    });
  }
});

// @desc    Get all posts
// @route   GET /posts
router.get("/posts", async (req, res) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      req.token = bearerHeader.split(" ")[1];
    }

    let posts = await Post.find().lean().exec();

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

// @desc    Like a post
// @route   POST /posts/like
// @params  shortUUID, action
router.post("/posts/like", verifyToken, async (req, res) => {
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

/**
 * @desc Login user and generate token
 */
router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res
        .status(200)
        .json({ status: "ERR", desc: "Username or password is incorrect" });
    }

    if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
      let token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET_KEY
      );

      res.status(200).json({ status: "OK", token: token });
    } else {
      return res
        .status(200)
        .json({ status: "ERR", desc: "Username or password is incorrect" });
    }
  } catch (ex) {
    res.status(200).json({ status: "ERR", desc: ex.message });
  }
});

/**
 * @desc Verify token
 */
router.post("/verifyToken", verifyToken, async (req, res) => {
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
