const config = require("../config");
const jwt = require("jsonwebtoken");

exports.tokenUser = user => {
  const timestamp = new Date().getTime();
  return jwt.sign({ id: user._id, iat: timestamp }, config.secretKey.key);
};
