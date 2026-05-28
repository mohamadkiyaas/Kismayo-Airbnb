import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const fmt = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}] ${stack || message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), fmt),
  transports: [new winston.transports.Console({ format: combine(colorize(), fmt) })],
});
