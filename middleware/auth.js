const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");

const auth = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const verifed = jwt.verify(token, secretKey.key);

    req.user = verifed;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = auth;
