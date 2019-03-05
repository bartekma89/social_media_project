const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const config = require("../../config");

const jwt = require("jsonwebtoken");
const passport = require("passport");

const tokenUser = require("../../helpers").tokenUser;

/* POST Register */

router.post("/", async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!name || !email || !password) {
      return res.status(422).json({
        error: "You must provide name and emial and password"
      });
    }

    if (user) {
      return res.status(422).json({
        error: "The user exist"
      });
    }

    try {
      const newUser = new User({
        name,
        email,
        password
      });

      await newUser.save();

      return res.status(200).json({ success: true, token: tokenUser(newUser) });
    } catch (err) {
      res.status(500).json({ error: err });
      return next(err);
    }
  } catch (err) {
    res.status(500).json({ error: err });
    return next(err);
  }
});

module.exports = router;
