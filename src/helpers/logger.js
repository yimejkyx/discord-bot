import winston from "winston";

const date = new Date().toISOString();
const logFormat = winston.format.printf(
  (info) => `${date}-${info.level}: ${JSON.stringify(info.message)}\n`
);

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
      level: "debug",
    }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
