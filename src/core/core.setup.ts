import { TransformInterceptor } from '../common/interceptors';
import { ValidationPipe } from './../common/pipes/validation.pipe';
import { ErrorMicroserviceFilter } from './../common/filters/error.filter';
import { ConfigCore } from './../shared/types/config.type';
import { AppUtils } from './../common/utils/app.utils';
import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceSetupOptions } from './types';
import { KafkaTransporter, NatsTransporter } from './transporters';

export async function microserviceSetup(
  app: INestApplication,
  options?: MicroserviceSetupOptions,
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
  app.useGlobalFilters(new ErrorMicroserviceFilter());

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

  //- Khởi service và lắng nghe dưới chế độ microservice
  await app.startAllMicroservices();
  await app.listen(options.port);

  // Log ra màn hình
  const serviceName = options.serviceName;
  const serviceUrl = await app.getUrl();
  Logger.log(`[Nest-core] Service ${serviceName} running on: ${serviceUrl}`);
}
