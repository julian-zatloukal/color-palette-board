const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

var User = require("../models/User");
var Post = require("../models/Post");

const base64url = require("base64url");
const crypto = require("crypto");

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

    let computeHash = req.body.password;

    var newUser = new User({
      username: req.body.username,
      email: req.body.email,
      passwordHash: computeHash,
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
// @params  username, palette
router.post("/posts/create", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username }).exec();

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
    let posts = await Post.find().lean().exec();


    posts = await Promise.all( posts.map(  async (post) => {
        let user = await User.findById(post.userId).exec();
        return {...post, author: {username: user.username, profilePicure: ""}};
    }));


    res.status(200).json({ status: "OK", data: posts });
  } catch (err) {
    res.status(200).json({
      status: "ERR",
      desc: `Error retrieving all posts ${err.message}`,
    });
  }
});

module.exports = router;
