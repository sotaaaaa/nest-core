import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Message = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const context = ctx.switchToRpc().getData();
    return context.value;
  },
);

export const MessageHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const context = ctx.switchToRpc().getData();
    return context.headers;
  },
);

export const MessageKey = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const context = ctx.switchToRpc().getData();
    return context.key;
  },
);

export const MessageContext = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const context = ctx.switchToRpc().getData();
    return context.context;
  },
);

export const MessageTimestamp = createParamDecorator(
  (data: string, ctx: ExecutionContext): string => {
    const context = ctx.switchToRpc().getData();
    return context?.context?.timestamp || Date.now();
  },
);
