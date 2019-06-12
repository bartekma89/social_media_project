const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const User = require("../../models/User");

router.get("/", auth, async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id).select(["-password", "-__v"]);

    return res.status(200).json(user);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
