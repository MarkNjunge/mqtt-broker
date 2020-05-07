const Mongoose = require("mongoose");

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
  async add(topic, payload, qos, clientId, messageId, retain) {
    const data = new MqttDataModel({
      topic,
      payload,
      qos,
      clientId,
      messageId,
      retain,
      timestamp: parseInt(Date.now() / 1000)
    });
    await data.save();
  }
};

module.exports = MqttData;
