const Mongoose = require("mongoose");

const ClientSchema = Mongoose.Schema({
  clientId: String,
  connected: Boolean,
  updated: Number
});

const ClientModel = Mongoose.model("client", ClientSchema);

const Client = {
  async add(clientId, connected) {
    // Determine if the client had previously connected
    let client = await ClientModel.findOne({ clientId });

    // If the client had previously connected, update their connection status
    // If they haven't save them as a new client
    if (client == null) {
      client = new ClientModel({
        clientId,
        connected,
        updated: parseInt(Date.now() / 1000)
      });
      await client.save();
    } else {
      client.connected = connected;
      client.updated = parseInt(Date.now() / 1000);
      await ClientModel.updateOne({ clientId: client.clientId }, client);
    }
  }
};

module.exports = Client;
