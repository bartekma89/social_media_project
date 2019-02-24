const passport = require("passport");
const Authentication = require("./controllers/authentication");
const passportService = require("./services/passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });

module.exports = app => {
  app.get("/", requireAuth, (req, res) => {
    res.json({
      hi: "dude"
    });
  });

  app.post("/signup", Authentication.signup);

  app.post("/signin", requireLogin, Authentication.signin);

  app.all("/*", (req, res) => {
    res.status(400).send("Invalid URL");
  });
};
