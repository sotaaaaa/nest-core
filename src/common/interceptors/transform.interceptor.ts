import * as _ from 'lodash';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: Record<string, any>) => {
        const response = context.switchToHttp().getResponse<Response>();
        response.status(HttpStatus.OK);

        return Array.isArray(data) ? data : _.omit(data, ['headers']);
      }),
    );
  }
}
