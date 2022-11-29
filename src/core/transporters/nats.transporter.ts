import { INestApplication, Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import * as _ from 'lodash';
import { ApplicationSetupOptions } from 'src/application';
import { AppUtils } from 'src/common';
import { ConfigCore } from 'src/shared';
import { MicroserviceSetupOptions } from '../types';

export class NatsTransporter {
  public static options: ConfigCore;
  public static application: INestApplication;

  public static setup(
    app: INestApplication,
    options: MicroserviceSetupOptions | ApplicationSetupOptions,
  ) {
    this.options = AppUtils.loadFile(options.configPath);
    this.application = app;

    // Cấu hình toàn bộ transporters theo cấu hình ở file yaml
    this.setupTransporters();
  }

  /**
   * Trả về cấu hình nats sevrer
   * @param configs
   */
  static getTransporterConfigs(configs: ConfigCore) {
    const enable: boolean = _.get(configs, 'transporters.nats.enable', false);
    const options = _.get(configs, 'transporters.nats.options');

    return {
      enable: enable,
      options: options,
    };
  }

  /**
   * Cấu hình nats event driver
   */
  public static setupTransporters() {
    const nats = this.getTransporterConfigs(this.options);

    //> Nếu nats được bật sẽ thực hiện connect đến nats
    if (nats.enable) {
      this.application.connectMicroservice<MicroserviceOptions>(
        { transport: Transport.NATS, options: nats.options },
        { inheritAppConfig: true },
      );

      Logger.log('[Nest-core] Connected to plugin nest-nats');
    }
  }
}
