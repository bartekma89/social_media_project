const express = require("express");
const router = express.Router();
const User = require("../../models/User");

const validateRegisterInput = require("../../validation/register");

// @route   POST api/join (register)
// @desc    Register user
// @access  Public

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({ email }).exec();

    if (user) {
      errors.email = "The user exist";
      return res.status(422).json({
        errors
      });
    }

    const newUser = new User({
      name,
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
