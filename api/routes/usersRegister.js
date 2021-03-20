const router = require("express").Router();
const User = require("../models/User");
var bcrypt = require('bcryptjs');

// @desc    Register user
// @route   POST /users/register
router.post("/", async (req, res) => {
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

module.exports = router;