const winston = require("winston");
const aedes = require("aedes")();
const ws = require("websocket-stream");

const { mqttPort, savePayloads, attachHttp, httpPort } = require("./config");
const MqttData = require("./database/mqttData");
const Client = require("./database/client");

function createServer() {
  const server = require("net").createServer(aedes.handle);

  server.listen(mqttPort, function() {
    winston.info(`Broker successfully started on port ${mqttPort}`);
  });

  if (attachHttp == true) {
    const httpServer = require("http").createServer();
    ws.createServer({ server: httpServer }, aedes.handle);

    httpServer.listen(httpPort, () => {
      winston.info(`Broker attached to port ${httpPort}`);
    });
  }

  aedes.on("client", async client => {
    winston.info(`Client connected: ${client.id}`);

    await Client.add(client.id, true);
  });

  aedes.on("clientDisconnect", async client => {
    winston.info(`Client disconnected: ${client.id}`);

    await Client.add(client.id, false);
  });

  aedes.on("publish", async (packet, client) => {
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

  server.on("clientReady", () => {
    winston.info(`Broker successfully started on port ${mqttPort}`);
  });

  return server;
}

module.exports = {
  createServer
};
