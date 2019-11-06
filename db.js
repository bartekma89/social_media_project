const mongoose = require("mongoose");

const { password, user, serverUrl } = require("./config").db;

mongoose.Promise = global.Promise;

const run = async () => {
  try {
    mongoose.connect(`mongodb://${user}:${password}${serverUrl}`, {
      useNewUrlParser: true
    });
    console.log("Connected");
  } catch (e) {
    console.log("Something screw up");
    console.error(e.stack);
  }
};

run();
