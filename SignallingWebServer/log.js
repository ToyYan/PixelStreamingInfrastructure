const winston = require('winston');
const dayjs = require('dayjs');
const config = require('./config.json');


const format = winston.format.printf(({ level, message, label, timestamp }) => {
  const date = dayjs(timestamp);
  return `${date.format('YYYY-MM-DD hh:mm:ss')} : ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    format
  ),
  defaultMeta: {},
  transports: [
    new winston.transports.File({ filename: `${config.logFilePath}` }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format,
  }));
}

module.exports = logger;