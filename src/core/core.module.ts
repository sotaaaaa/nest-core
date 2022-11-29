import { AppUtils } from './../common/utils/app.utils';
import { Module, DynamicModule, Type, ForwardReference } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModuleRegister } from './types';

@Module({})
export class CoreModule {
  static register(options: CoreModuleRegister): DynamicModule {
    const configs = AppUtils.loadFile(options.path);
    const importPlugins = options?.plugins || [];
    const imports = [
      ConfigModule.forRoot({ load: [() => configs], isGlobal: true }),
      ...importPlugins,
    ];

    return {
      module: CoreModule,
      imports: imports,
    };
  }
}
