const express = require("express");
const router = express.Router();
const passport = require("passport");

const tokenUser = require("../../helpers").tokenUser;

/* POST Login */

router.post("/", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("err", err);
    console.log("user", user);
    console.log("info", info);

    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({
        message: info ? info.message : "Login failed",
        user: user
      });
    }

    return res.status(200).json({
      token: tokenUser(user)
    });
  })(req, res, next);
});

module.exports = router;
