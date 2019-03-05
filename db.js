const mongoose = require("mongoose");

const config = require("./config");

mongoose.Promise = global.Promise;

const run = async () => {
  try {
    mongoose.connect(
      `mongodb://${config.db.user}:${
        config.db.password
      }@ds349045.mlab.com:49045/mern_project`,
      {
        useNewUrlParser: true
      }
    );
    console.log("Connected");
  } catch (e) {
    console.log("Something screw up");
    console.error(e.stack);
  }
};

run();
