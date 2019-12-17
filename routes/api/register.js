const express = require('express');
const gravatar = require('gravatar');
const { isNil } = require('lodash');

const router = express.Router();
const User = require('../../models/User');

const validateRegisterInput = require('../../validation/register');

// @route   POST /join (register)
// @desc    Register user
// @access  Public

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findOne({ email }).exec();
    const userName = await User.findOne({ username }).exec();
    const avatar = gravatar.url(email, {
      s: '100',
      r: 'pg',
      d: 'mm'
    });

    if (!isNil(user)) {
      errors.email = 'The user exists';
      if (!isNil(userName)) {
        errors.username = 'The username exists';
      }
      return res.status(422).json(errors);
    }

    const newUser = new User({
      username,
      email,
      password,
      avatar
    });

    await newUser.save();

    return res.status(200).json({ user: newUser.toAuthJSON() });
  } catch (err) {
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
