import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();
    const stack = exception.stack;
    let message = exception.message;

    if (exception.response?.message) {
      if (Array.isArray(exception.response?.message)) {
        message = exception.response.message[0];
      } else {
        message = exception.response.message;
      }
    }

    response.status(status).json({
      message: message,
      statusCode: status,
      error: exception.name,
    });
  }
}
