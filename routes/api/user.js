const express = require("express");
const router = express.Router();
const User = require("../../model/user");

router.get("/current/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(400).json({
        error: "User does not exist"
      });
    }

    return res.status(200).json({
      user
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
    return next(err);
  }
});

module.exports = router;
