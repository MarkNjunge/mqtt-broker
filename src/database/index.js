const mongoose = require("mongoose");

const { mongoUri } = require("../config");

let isConnected = false;

async function connect() {
  const connectOptions = {
    useNewUrlParser: true,
    keepAlive: 1,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 30000
  };

  await mongoose.connect(mongoUri, connectOptions);
  isConnected = true;
}

module.exports = {
  connect,
  isConnected
};
