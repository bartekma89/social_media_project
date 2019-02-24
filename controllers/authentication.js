const User = require("../model/user");
const isEmpty = require("lodash/isEmpty");
const jwt = require("jsonwebtoken");
const config = require("../config");

function tokenUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ id: user._id, iat: timestamp }, config.secretKey.key);
}

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (isEmpty(email) || isEmpty(password)) {
      return res.status(422).json({
        error: "You must provide emial and password"
      });
    }

    if (user) {
      return res.status(422).json({
        error: "The user exist"
      });
    }

    try {
      const newUser = new User({
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
};

exports.signin = (req, res, next) => {
  res.json({
    token: tokenUser(req.user)
  });
};
