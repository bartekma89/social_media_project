const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const { isNil } = require("lodash");

const validateRegisterInput = require("../../validation/register");

// @route   POST /join (register)
// @desc    Register user
// @access  Public

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({ email }).exec();
    const userName = await User.findOne({ username }).exec();

    if (!isNil(user)) {
      errors.email = "The user exists";
      if (!isNil(userName)) {
        errors.username = "The username exists";
      }
      return res.status(422).json(errors);
    }

    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    return res.status(200).json({ user: newUser.toAuthJSON() });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

module.exports = router;
