const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
var bcrypt = require('bcryptjs');

router.post("/", async (req, res) => {
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

module.exports = router;
