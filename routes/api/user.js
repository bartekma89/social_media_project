const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const passport = require("passport");

// @route   GET api/users/all
// @desc    Return all users
// @access  Public

router.get("/all", async (req, res) => {
  try {
    const users = await User.find({});

    console.log(users);

    if (!users) {
      return res.status(400).json({ message: "Users are not exist" });
    }

    const usersInfo = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      date: user.date
    }));

    return res.status(200).send(usersInfo);
  } catch (err) {
    return res.status(500).json({
      error: err
    });
  }
});

// @route   GET api/users/:current
// @desc    Return current api
// @access  Public

router.get("/current", async (req, res) => {
  return res.status(200).json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    date: req.user.date
  });
});

module.exports = router;
