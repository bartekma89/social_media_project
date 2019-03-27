const express = require("express");
const router = express.Router();
const passport = require("passport");
const validateLoginInput = require("../../validation/login");
const { isEmpty } = require("lodash");

// @route   POST api/login
// @desc    Login User / Returning JWT Token
// @access  Public

router.post("/", (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  return passport.authenticate(
    "local",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        return res.status(200).json({
          user: user.toAuthJSON()
        });
      }

      errors.email = !isEmpty(info) ? info.message : "Login failed";
      return res.status(400).json({ errors });
    }
  )(req, res, next);
});

module.exports = router;
