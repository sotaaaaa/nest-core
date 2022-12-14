import { ErrorResponse } from './../../shared/types/error.type';
import { HttpException, HttpStatus } from '@nestjs/common';

export type ErrorType = number | ErrorResponse;

// In case if we want to return success, with custom status code
export class ErrorException extends HttpException {
  constructor(error: ErrorType) {
    const message = 'An error occurred';

    if (typeof error === 'number') {
      const context = { code: error, message };
      super(context, HttpStatus.OK);
    } else {
      const context = { ...error, message: error.message || message };
      super(context, HttpStatus.OK);
    }
  }
}
