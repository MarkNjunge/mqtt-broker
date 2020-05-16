const winston = require("winston");
const aedes = require("aedes")();
const ws = require("websocket-stream");

const { mqttPort, savePayloads, attachHttp, httpPort } = require("./config");
const MqttData = require("./database/mqttData");
const Client = require("./database/client");

function createServer() {
  const server = require("net").createServer(aedes.handle);

  aedes.authenticate = function (client, username, password, callback) {
    const success = true;
    if (success) {
      callback(null, true);
    } else {
      var error = new Error("Auth error");
      // See http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc385349256
      error.returnCode = 4;
      callback(error, null);
    }
  };

  aedes.on("client", async client => {
    const data = { client: client.id };
    winston.debug(`[connected] ${JSON.stringify(data)}`);

    await Client.add(client.id, true);
  });

  aedes.on("clientDisconnect", async client => {
    const data = { client: client.id };
    winston.debug(`[disconnected] ${JSON.stringify(data)}`);

    await Client.add(client.id, false);
  });

  aedes.on("clientReady", async client => {
    const data = { client: client.id };
    winston.debug(`[ready] ${JSON.stringify(data)}`);
  });

  aedes.on("publish", async (packet, client) => {
    if (packet.topic.startsWith("$SYS")) return;

    const data = { client: client.id, topic: packet.topic, payload: packet.payload.toString() };
    winston.debug(`[publish] ${JSON.stringify(data)}`);

    if (savePayloads == true) {
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

  aedes.on("subscribe", async (subscriptions, client) => {
    const data = { client: client.id, topic: subscriptions[0].topic };
    winston.debug(`[subscribed] ${JSON.stringify(data)}`);
  });

  aedes.on("unsubscribe", async (sub, client) => {
    const data = { client: client.id, topic: sub[0] };
    winston.debug(`[unsubscribed] ${JSON.stringify(data)}`);
  });

  aedes.on("clientError", async (client, error) => {
    const data = { client: client.id, error: error.message };
    winston.debug(`[error] ${JSON.stringify(data)}`);
  });

  server.listen(mqttPort, function () {
    winston.info(`Broker started on port ${mqttPort}`);
  });

  if (attachHttp == true) {
    const httpServer = require("http").createServer();
    ws.createServer({ server: httpServer }, aedes.handle);

    httpServer.listen(httpPort, () => {
      winston.info(`HTTP broker attached to port ${httpPort}`);
    });
  }

  return server;
}

module.exports = {
  createServer
};
