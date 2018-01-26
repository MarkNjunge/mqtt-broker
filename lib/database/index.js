const mongoose = require("mongoose");
const winston = require("winston");

const { mongoUri } = require("./../config");

function connect() {
  return new Promise((resolve, reject) => {
    mongoose.Promise = require("bluebird");
    const connectOptions = {
      useMongoClient: true,
      keepAlive: 1,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      connectTimeoutMS: 30000
    };

    mongoose.connect(mongoUri, connectOptions);
    const db = mongoose.connection;

    db.on("error", reason => {
      reject(reason);
    });

    db.on("open", () => {
      resolve();
    });

    db.on("disconnected", () => {
      winston.warn("Disconnected from mongo");
    });
  });
}

module.exports = {
  connect
};
