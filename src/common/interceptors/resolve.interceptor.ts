import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ERROR_CODES } from '../constants';

export function MixinResolveInterceptor(
  message?: string,
): Type<NestInterceptor> {
  @Injectable()
  class MixinResolveInterceptor implements NestInterceptor<Promise<any>> {
    intercept(context: ExecutionContext, next: CallHandler) {
      return next.handle().pipe(
        map((data: Record<string, any>) => {
          const code = ERROR_CODES.HTTP_SUCCESS;

          //- RPC sẽ lấy thông tin headers đính vào headers của gateway
          if (context.getType() === 'rpc') {
            const ctx = context.switchToRpc();
            const { headers } = ctx.getData();

            return {
              code,
              data,
              message,
              headers,
            };
          }

          return { code, data, message };
        }),
      );
    }
  }

  return mixin(MixinResolveInterceptor);
}
