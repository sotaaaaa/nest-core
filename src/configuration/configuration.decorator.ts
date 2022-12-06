import { ConfigurationService } from './configuration.service';
import { Inject } from '@nestjs/common';

export function Configuration(): (
  target: Record<string, any>,
  key: string | symbol,
  index?: number,
) => void {
  return Inject(ConfigurationService);
}
