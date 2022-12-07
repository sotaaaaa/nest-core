import { INestApplication, Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import * as _ from 'lodash';
import { ApplicationSetupOptions } from 'src/application';
import { AppUtils } from 'src/common';
import { ConfigCore } from 'src/shared';
import { MicroserviceSetupOptions } from '../../core/types';

export class KafkaTransporter {
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
   * Trả về cấu hình kafka sevrer
   * @param configs
   */
  static getTransporterConfigs(configs: ConfigCore) {
    const enable: boolean = _.get(configs, 'transporters.kafka.enable');
    const options = _.get(configs, 'transporters.kafka.options');

    return {
      enable: enable,
      options: options,
    };
  }

  /**
   * Cấu hình kafka event driver
   */
  public static setupTransporters() {
    const kafka = this.getTransporterConfigs(this.options);

    //> Nếu kafka được bật sẽ thực hiện connect đến kafka
    if (kafka.enable) {
      this.application.connectMicroservice<MicroserviceOptions>(
        { transport: Transport.KAFKA, options: kafka.options },
        { inheritAppConfig: true },
      );

      Logger.log('[NestCore] Connected to plugin nest-kafka');
    }
  }
}
