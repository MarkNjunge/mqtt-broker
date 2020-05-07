const winston = require("winston");
const database = require("./database");
const broker = require("./broker");
const { mongoUri } = require("./config");

async function main() {
  winston.configure({
    level: "debug",
    transports: [
      new winston.transports.Console({
        colorize: true,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        json: false
      })
    ]
  });

  if (mongoUri != "") {
    await database.connect();
    winston.info("Connected to database");
  }
  broker.createServer();
}
main();
