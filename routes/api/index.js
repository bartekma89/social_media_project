const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json({
    hi: "dude"
  });
});

module.exports = router;
