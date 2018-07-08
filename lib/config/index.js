module.exports = {
  httpPort: parseInt(process.env.HTTP_PORT) || 8080,
  mqttPort: parseInt(process.env.MQTT_PORT) || 1883,
  mongoUri: process.env.MONGODB_URI,
  savePayloads: process.env.SAVE_PAYLOADS || false
};
