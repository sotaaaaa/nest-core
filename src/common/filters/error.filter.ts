import { ErrorResponse } from './../../shared/types/error.type';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppUtils } from '../utils/app.utils';

@Catch()
export class ErrorApplicationFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const exceptionResponse =
      (exception.getResponse && exception.getResponse()) || {};
    const { statusCode, code, errors, message } =
      exceptionResponse as ErrorResponse & {
        statusCode: HttpStatus;
      };
    const errorCode = code || AppUtils.mappingErrorCode(statusCode);

    //- Log exception infomation
    Logger.error(exception);

    response.status(HttpStatus.OK).json({
      code: errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors: errors,
      message: message || 'An error occurred',
    });
  }
}

//- Bộ filter cho các microservice (Muốn trả về client phải đi qua bộ của API GATEWAY)
@Catch()
export class ErrorMicroserviceFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const exceptionResponse =
      (exception.getResponse && exception.getResponse()) || {};
    const { statusCode, code, errors, message } =
      exceptionResponse as ErrorResponse & {
        statusCode: HttpStatus;
      };
    const errorCode =
      code || AppUtils.mappingErrorCode(statusCode || exception['code']);

    //- Log exception infomation
    Logger.error(exception);

    return {
      code: errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors: errors,
      message: message || 'An error occurred',
    };
  }
}
