const mosca = require("mosca");
const winston = require("winston");

const { mqttPort, savePayloads } = require("./config");
const MqttData = require("./database/MqttData");
const Client = require("./database/client");

const server = new mosca.Server({
  port: mqttPort,
  persistence: {
    factory: mosca.persistence.Memory
  }
});

server.on("clientConnected", client => {
  winston.info(`Client connected: ${client.id}`);

  Client.add(client.id, true);
});

server.on("clientDisconnected", client => {
  winston.info(`Client disconnected: ${client.id}`);

  Client.add(client.id, false);
});

server.on("published", (packet, client) => {
  winston.info(`Published: ${packet.topic}, ${packet.payload}`);

  if (savePayloads == "true" && packet && client) {
    MqttData.add(
      packet.topic,
      packet.payload.toString(),
      packet.qos,
      client.id,
      packet.messageId,
      packet.retain
    );
  }
});

server.on("ready", () => {
  winston.info(`Broker successfully started on port ${mqttPort}`);
});

module.exports = server;
