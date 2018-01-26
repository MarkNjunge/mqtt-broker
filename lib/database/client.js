const Mongoose = require("mongoose");
const winston = require("winston");

const ClientSchema = Mongoose.Schema({
  clientId: String,
  connected: Boolean,
  updated: Number
});

const ClientModel = Mongoose.model("client", ClientSchema);

const Client = {
  add(clientId, connected) {
    ClientModel.findOne({ clientId })
      .then(client => {
        if (client == null) {
          saveNewClient(clientId, connected);
        } else {
          updateClient(client, connected);
        }
      })
      .catch(reason => {
        winston.error(reason);
      });
  }
};

function saveNewClient(clientId, connected) {
  const client = new ClientModel({
    clientId,
    connected,
    updated: parseInt(Date.now() / 1000)
  });
  client
    .save()
    .then(() => winston.info(`Updated clients: ${clientId}, ${connected}`))
    .catch(reason => winston.error(reason));
}

function updateClient(client, connected) {
  client.connected = connected;
  client.updated = parseInt(Date.now() / 1000);
  ClientModel.update({ clientId: client.clientId }, client, err => {
    if (err) {
      winston.error(err);
    } else {
      winston.info(`Updated clients: ${client.clientId}, ${connected}`);
    }
  });
}

module.exports = Client;
