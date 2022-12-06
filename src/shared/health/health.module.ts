import { HealthController } from './health.controller';
import { DynamicModule, Global, Module } from '@nestjs/common';

@Global()
@Module({})
export class HealthModule {
  static forRoot(): DynamicModule {
    return {
      module: HealthModule,
      controllers: [HealthController],
    };
  }
}
