const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { isEmpty } = require("lodash");

// @route   GET /users/all
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

// @route   GET /users/:current
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

// @route   POST /users/username/:username/exist
// @desc    Check username exist
// @access  Public

router.get("/username/:username/exist", async (req, res) => {
  try {
    console.log("param", req.params.username);

    const user = await User.findOne({ name: req.params.username }).exec();

    console.log("user", user);

    if (!isEmpty(user)) {
      return res.status(400).json({ success: false, error: "Username exists" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log("errr");
    return res.status(500).json({ error: "Error" });
  }
});

module.exports = router;
