import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { AbstractLoggerService } from './logger-service.abstract';
import { Environment } from 'src/common/global.enums';

@Injectable()
export class LoggerService implements AbstractLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(
        (info) =>
          `${info.timestamp} [${info.level}]: ${info.message} ${info.meta ? JSON.stringify(info.meta) : ''}`,
      ),
    );
    this.logger = winston.createLogger({
      format,
      transports: [
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error',
        }),
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
        }),
      ],
    });

    if (process.env.NODE_ENV !== Environment.PRODUCTION) {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), format),
        }),
      );
    }
  }

  log(message: string, meta?: any) {
    if (meta) {
      this.logger.info(message, { meta });
    } else {
      this.logger.info(message);
    }
  }

  warning(message: string, meta?: any) {
    if (meta) {
      this.logger.warn(message, { meta });
    } else {
      this.logger.warn(message);
    }
  }

  error(message: string, meta?: any) {
    if (meta) {
      this.logger.error(message, { meta });
    } else {
      this.logger.error(message);
    }
  }
}
