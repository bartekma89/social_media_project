const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require("http");
const app = express();
const passport = require("passport");

const index = require("./routes/api/index");
const register = require("./routes/api/register");
const user = require("./routes/api/user");
const login = require("./routes/api/auth");

const db = require("./db");
const passportStratedy = require("./services/passport");

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/index", passport.authenticate("jwt", { session: false }), index);
app.use("/join", register);
app.use("/user", passport.authenticate("jwt", { session: false }), user);
app.use("/login", login);

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
