import { ErrorApplicationFilter } from './../common/filters/error.filter';
import { ValidationPipe } from './../common/pipes/validation.pipe';
import { ConfigCore } from '../shared/types/config.type';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { INestApplication, Logger } from '@nestjs/common';
import { AppUtils } from '../common/utils/app.utils';
import { ApplicationSetupOptions } from './types/gateway.type';
import { KafkaTransporter, NatsTransporter } from 'src/core';

/**
 * Thực hiện khởi tạo một application
 * Được build trên nền tảng NestJS
 * @param app
 * @param options
 */
export async function applicationSetup(
  app: INestApplication,
  options: ApplicationSetupOptions,
) {
  // Kill process
  AppUtils.killAppWithGrace(app);

  // Enable shutdown hooks
  app.enableShutdownHooks();

  /**
   * Setup các interceptors cho toàn bộ application
   * Lưu ý có thể bật tắt trong file config
   */
  const { application } = AppUtils.loadFile<ConfigCore>(options.configPath);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new ErrorApplicationFilter());

  // Bật validation nếu cờ bật bằng true (Mặc định bằng false)
  if (application.validation.enable) {
    app.useGlobalPipes(new ValidationPipe(options.configPath));
  }

  /**
   * Danh sách các transporter được hỗ trợ
   * - KAFKA và NATS
   */
  NatsTransporter.setup(app, options);
  KafkaTransporter.setup(app, options);

  // Khởi service và lắng nghe dưới chế độ microservice
  await app.startAllMicroservices();
  await app.listen(options.port);

  // Log ra màn hình
  const serviceName = options.serviceName;
  const serviceUrl = await app.getUrl();
  Logger.log(`[Nest-core] Service ${serviceName} running on: ${serviceUrl}`);
}
