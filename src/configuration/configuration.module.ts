import { ConfigurationService } from './configuration.service';
import {
  ConfigurationDocument,
  ConfigurationSchema,
} from './schemas/configuration.schema';
import { CacheModule, DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({})
export class ConfigurationModule {
  static forMongoose(connectionName: string): DynamicModule {
    return {
      module: ConfigurationModule,
      providers: [ConfigurationService],
      exports: [ConfigurationService],
      imports: [
        MongooseModule.forFeature(
          [{ name: ConfigurationDocument.name, schema: ConfigurationSchema }],
          connectionName,
        ),
        CacheModule.register(),
      ],
    };
  }
}
