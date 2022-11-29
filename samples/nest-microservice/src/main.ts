import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { microserviceSetup } from '@sotaaaaa/nest-core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  await microserviceSetup(app, {
    serviceName: 'SERVICE_CRON',
    configPath: process.env.configfile || './service.config.yaml',
    port: configService.get<number>('application.port'),
  });
}
bootstrap();
