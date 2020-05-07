const winston = require("winston");
const database = require("./database");
const broker = require("./broker");

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

database
  .connect()
  .then(() => {
    winston.info("Connected to database");
    broker.createServer();
  })
  .catch(err => {
    winston.error(err.message);
    broker.createServer();
  });
