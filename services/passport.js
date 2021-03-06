const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");
const User = require("../models/User");
const { secretKey } = require("../config");

const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("x-auth-token"),
  secretOrKey: secretKey.key
};

const localOptions = {
  usernameField: "email"
};

const localLogin = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).exec();

      if (!user) {
        return done(null, false, { message: "Incorrect email or password" });
      }

      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }

        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        return done(null, user);
      });
    } catch (err) {
      return done(err, false);
    }
  }
);

const jwtLogin = new JwtStrategy(JwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);
