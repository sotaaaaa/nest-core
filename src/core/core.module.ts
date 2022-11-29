import { AppUtils } from './../common/utils/app.utils';
import { Module, DynamicModule, Type, ForwardReference } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({})
export class CoreModule {
  static register(
    path: string,
    plugins?: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >,
  ): DynamicModule {
    const configs = AppUtils.loadFile(path);
    const importPlugins = plugins || [];
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
