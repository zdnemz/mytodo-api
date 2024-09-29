import { createLogger, format, transports, Logger } from 'winston';
import type { StreamOptions } from 'morgan';
import DailyRotateFile from 'winston-daily-rotate-file';

const logFormat = format.printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? `\nStack: ${stack}` : ''}`;
});

const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
      maxSize: '20m',
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m',
    }),
  ],
  exitOnError: false,
});

const stream: StreamOptions = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export { logger, stream };
