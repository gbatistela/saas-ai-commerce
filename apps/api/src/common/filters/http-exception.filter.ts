import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = isHttpException ? exception.getResponse() : null;
    const message =
      typeof responseBody === 'string'
        ? responseBody
        : (responseBody as any)?.message || 'Error interno del servidor';

    if (!isHttpException) {
      // Solo logueamos con stack completo los errores no controlados
      this.logger.error(exception);
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: isHttpException ? exception.constructor.name : 'InternalServerError',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
