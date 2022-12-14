import { DynamicModule, Type, ForwardReference } from '@nestjs/common';

/**
 * Các loại format hỗ trợ đọc file cấu hình
 * Đang hỗ trợ Yaml và Json
 */
export enum MicroserviceSetupFormat {
  YAML = 'YAML',
  JSON = 'JSON',
}

/**
 * Khởi tạo một module microservice
 * Microservice đóng vai trò điều phối request và response
 */
export interface MicroserviceSetupOptions {
  serviceName: string;
  configPath: string;
  port: number;
  format?: MicroserviceSetupFormat;
}

export interface CoreModuleRegister {
  path: string;
  plugins?: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
}
