# MQTT Broker

A node.js MQTT broker app with (optional) data storage in MongoDB.

For an explanation of MQTT, see [MQTT Essentials](https://www.hivemq.com/mqtt-essentials/).

# Installation

1. Clone the repository and install the dependencies

```
git clone https://github.com/MarkNjunge/mqtt-broker.git
```

2. Install dependencies

```
yarn install
```

3. Create a .env file similar to [.env.sample](./.env.sample) in the root directory.

```
cp .env.sample .env
```

4. Run the broker

```
yarn start
```

# Usage

Connect to the broker using the url `mqtt://localhost:1883` using a client app such as [MQTTBox](http://workswithweb.com/mqttbox.html).

To attach the broker to a http server, set `ATTACH_HTTP` to **true** and `HTTP_PORT` to your desired port. Then connect to `ws://localhost:3000`

# Built with

- [Aedes](https://www.npmjs.com/package/aedes)
- [Mongoose](http://mongoosejs.com/)
