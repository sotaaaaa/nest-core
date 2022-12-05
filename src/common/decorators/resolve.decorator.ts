import { applyDecorators, UseFilters, UseInterceptors } from '@nestjs/common';
import { ErrorApplicationFilter, ErrorMicroserviceFilter } from '../filters';
import { MixinResolveInterceptor } from '../interceptors';

/**
 * Sử dụng bộ filter cho microservice
 */
export const ServiceToGateway = (message?: string) => {
  return applyDecorators(
    UseInterceptors(MixinResolveInterceptor(message)),
    UseFilters(ErrorMicroserviceFilter),
  );
};

/**
 * Sử dụng bộ filter cho application
 */
export const GatewayToClient = (message?: string) => {
  return applyDecorators(
    UseInterceptors(MixinResolveInterceptor(message)),
    UseFilters(ErrorApplicationFilter),
  );
};

/**
 * Sử dụng bộ filter cho microservice
 */
export const ServiceToService = () => {
  return applyDecorators(UseFilters(ErrorMicroserviceFilter));
};
