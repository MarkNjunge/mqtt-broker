const Mongoose = require("mongoose");
const winston = require("winston");

const MqttDataSchema = Mongoose.Schema(
  {
    topic: String,
    payload: String,
    qos: { type: Number, default: 0 },
    clientId: String,
    messageId: String,
    retain: { type: Boolean, default: false },
    timestamp: Number
  },
  { collection: "data" }
);

const MqttDataModel = Mongoose.model("data", MqttDataSchema);

const MqttData = {
  add(topic, payload, qos, clientId, messageId, retain) {
    const data = new MqttDataModel({
      topic,
      payload,
      qos,
      clientId,
      messageId,
      retain,
      timestamp: parseInt(Date.now() / 1000)
    });
    data
      .save()
      .then(() => {
        winston.info(`Saved: ${topic}, ${payload}`);
      })
      .catch(reason => {
        winston.error(reason);
      });
  }
};

module.exports = MqttData;
