require("dotenv").config();

module.exports = {
  mqttPort: parseInt(process.env.MQTT_PORT) || 1883,
  attachHttp: process.env.ATTACH_HTTP == "true",
  httpPort:
    parseInt(process.env.HTTP_PORT) || parseInt(process.env.PORT) || 8080,
  mongoUri: process.env.MONGODB_URI || "",
  savePayloads: process.env.SAVE_PAYLOADS == "true"
};
