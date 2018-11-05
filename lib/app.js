const http = require("http");
const winston = require("winston");

const database = require("./database");
const broker = require("./broker");
const { attachHttp, httpPort } = require("./config");

winston.configure({
  transports: [
    new winston.transports.Console({
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false
    })
  ]
});

database
  .connect()
  .then(() => {
    winston.info("Connected to database");
    startBroker();
  })
  .catch(err => {
    winston.error(err.message);
    startBroker();
  });

function startBroker() {
  const server = broker.connect();

  if (attachHttp == true) {
    const httpServer = http.createServer();
    server.attachHttpServer(httpServer);

    httpServer.listen(httpPort, () => {
      winston.info(`Broker attached to port ${httpPort}`);
    });
  }
}
