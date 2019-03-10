const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.get("/all", async (req, res, next) => {
  try {
    const users = await User.find({}).exec();

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
    res.status(500).json({
      error: err
    });

    return next(err);
  }
});

router.get("/profile/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({
        error: "User does not exist"
      });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      date: user.date
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
    return next(err);
  }
});

module.exports = router;
