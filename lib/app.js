// See help using node src/app.js --help
const argv = require("yargs")
  .describe("attach", "Whether or not to attach the broker to a http server")
  .default("attach", false)
  .alias("a", "attach")
  .describe(
    "port",
    "The port to attach the http server to. Only used if attach is true"
  )
  .default("port", 8080)
  .alias("p", "port")
  .example("node src/$0 --attach=true").argv;

require("dotenv").config();

const http = require("http");
const winston = require("winston");
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

const database = require("./database");
const httpPort = argv.port || require("./config").httpPort;

database
  .connect()
  .then(() => {
    winston.info("Connected to database");
    const mqttServer = require("./broker");

    if (argv.attach == "true") {
      const httpServer = http.createServer();
      mqttServer.attachHttpServer(httpServer);

      httpServer.listen(httpPort, () => {
        winston.info(`Broker attached to port ${httpPort}`);
      });
    }
  })
  .catch(reason => winston.error(reason));
