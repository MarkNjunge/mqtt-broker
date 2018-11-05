# MQTT Broker

A node.js MQTT broker app with data storage in MongoDB.

For an explanation of MQTT, see [MQTT Essentials](https://www.hivemq.com/mqtt-essentials/).

# Installation

1. Clone the repository and install the dependencies
2. Create a .env file similar to [.env.sample](./.env.sample) in the root directory.

# Usage

1. Run the broker using `yarn start`.
2. Connect to the broker using the url `mqtt://localhost:1883` using a client app such as [MQTTBox](http://workswithweb.com/mqttbox.html).

- To attach the broker to a http server, set `ATTACH_HTTP` to **true** and `HTTP_PORT` to your desired port. Then connect to `ws://localhost:3000`

# Built with

- [Mosca](https://github.com/mcollina/mosca)
- [Mongoose](http://mongoosejs.com/)
