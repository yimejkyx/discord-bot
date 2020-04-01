const winston = require("winston");

let date = new Date().toISOString();
const logFormat = winston.format.printf(
  info => `${date}-${info.level}: ${JSON.stringify(info.message)}\n`
);

module.exports = {
  logger: winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), logFormat)
      })
    ]
  })
};
