import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import {
  exceptionMessages,
  httpStatusesByException,
} from './global-exception.constants';
import { AbstractLoggerService } from 'src/logger/logger-service.abstract';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(AbstractLoggerService) private logger: AbstractLoggerService,
  ) { }
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    let responseMessage = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      responseMessage =
        exception.getResponse()['message'] ||
        exception['response'] ||
        exceptionMessages.get(exception.constructor) ||
        responseMessage;
    } else if (exception instanceof Error) {
      responseMessage = exception.message;
    } else {
      const exceptionConstructor = (exception as Record<string, any>)
        ?.constructor;
      responseMessage =
        (exceptionConstructor && exceptionMessages.get(exceptionConstructor)) ||
        responseMessage ||
        'Internal Server Error';
    }

    console.log(exception);
    console.log('-----------------------------------------');
    console.log(responseMessage);

    for (const [
      ExceptionType,
      httpStatus,
    ] of httpStatusesByException.entries()) {
      if (exception instanceof ExceptionType) {
        status = httpStatus;
        break;
      }
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(responseMessage);
    } else {
      this.logger.log(`${status}, ${responseMessage}`);
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: responseMessage,
    });
  }
}
