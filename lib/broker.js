const mosca = require("mosca");
const winston = require("winston");

const { mqttPort, savePayloads } = require("./config");
const MqttData = require("./database/mqttData");
const Client = require("./database/client");

function connect() {
  const server = new mosca.Server({
    port: mqttPort,
    persistence: {
      factory: mosca.persistence.Memory
    }
  });

  server.on("clientConnected", async client => {
    winston.info(`Client connected: ${client.id}`);

    await Client.add(client.id, true);
  });

  server.on("clientDisconnected", async client => {
    winston.info(`Client disconnected: ${client.id}`);

    await Client.add(client.id, false);
  });

  server.on("published", async (packet, client) => {
    winston.info(`Published: ${packet.topic}, ${packet.payload}`);
    if (savePayloads == true && packet && client) {
      await MqttData.add(
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

  return server;
}

module.exports = {
  connect
};
