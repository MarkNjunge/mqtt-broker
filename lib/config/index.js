function mongoUri() {
  if (process.env.NODE_ENV == "production") {
    return process.env.MONGODB_URI;
  } else {
    return process.env.MONGODB_URI_DEV;
  }
}

module.exports = {
  httpPort: parseInt(process.env.HTTP_PORT) || 8080,
  mqttPort: parseInt(process.env.MQTT_PORT) || 1883,
  mongoUri: mongoUri(),
  savePayloads: process.env.SAVE_PAYLOADS || false
};
