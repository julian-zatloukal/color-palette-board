const express = require("express");
const router = express.Router();

/**
 * @desc    API root endpoint
 * @route   GET /
 * @params  <empty>
 */
router.get("/", (req, res) => {
  res.status(200).send("Up and running API");
});

/**
 * @desc    Register user
 * @route   POST /users/register
 * @params  username, email, password
 */
router.use("/users/register", require("./usersRegister"));

/**
 * @desc    Login user and generate token
 * @route   POST /login
 * @params  username, password
 */
router.use("/login", require("./login"));

/**
 * @desc    Verify token
 * @route   POST /verifyToken
 * @params  headers.Authorization
 */
router.use("/verifyToken", require("./verifyToken"));

/**
 * @desc    Create post
 * @route   POST /posts/create
 * @params  headers.Authorization, palette
 */
router.use("/posts/create", require("./postCreate"));

/**
 * @desc    Get all posts
 * @route   GET /posts
 * @params  <empty>
 */
router.use("/posts", require("./posts"));

/**
 * @desc    Like a post
 * @route   POST /posts/like
 * @params  headers.Authorization, shortUUID, action
 */
router.use("/posts/like", require("./postsLike"));

/**
 * @desc    Get post info by shortUuid
 * @route   POST /posts/id
 * @params  shortUUID
 */
router.use("/posts/id", require("./postsId"));




module.exports = router;
