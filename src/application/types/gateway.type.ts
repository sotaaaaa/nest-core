/**
 * Các loại format hỗ trợ đọc file cấu hình
 * Đang hỗ trợ Yaml và Json
 */
export enum ApplicationSetupFormat {
  YAML = 'YAML',
  JSON = 'JSON',
}

/**
 * Khởi tạo một module application
 * Application đóng vai trò điều phối request và response
 */
export interface ApplicationSetupOptions {
  serviceName: string;
  configPath: string;
  port: number;
  format?: ApplicationSetupFormat;
}
