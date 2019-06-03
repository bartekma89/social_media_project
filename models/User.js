const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");

const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre("save", async function(next) {
  try {
    const user = this;

    const genSalt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, genSalt);
    user.password = hash;

    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function(password, cb) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);

    return cb(null, isMatch);
  } catch (err) {
    return cb(err);
  }
};

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      iat: today.getTime(),
      exp: parseInt(expirationDate.getTime() / 1000, 10)
    },
    secretKey.key
  );
};

UserSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    token: this.generateJWT()
  };
};

module.exports = UserClass = mongoose.model("users", UserSchema);
