import { INestApplication } from '@nestjs/common';
import { ApplicationSetupOptions } from 'src/application';
import { MicroserviceSetupOptions } from '../../core/types';
import { KafkaTransporter } from './kafka.transporter';
import { NatsTransporter } from './nats.transporter';

export class CoreTransporter {
  /**
   * Danh sách các transporter được hỗ trợ
   * - KAFKA và NATS
   */
  public static startAllTransporters(
    app: INestApplication,
    options: MicroserviceSetupOptions | ApplicationSetupOptions,
  ) {
    NatsTransporter.setup(app, options);
    KafkaTransporter.setup(app, options);
  }
}
