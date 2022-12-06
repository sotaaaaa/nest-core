import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/healthz')
  async healthCheck() {
    return {
      status: 'Ready',
      timestamp: Date.now(),
    };
  }
}
