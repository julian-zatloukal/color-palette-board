const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const verifyToken = require("../middleware/verifyToken");
const crypto = require("crypto");
const base64url = require('base64url');

// @desc    Create post
// @route   POST /posts/create
// @params  token, palette
router.post("/", verifyToken, async (req, res) => {
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

module.exports = router;