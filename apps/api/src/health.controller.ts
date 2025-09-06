import { Controller, Get } from '@nestjs/common';

/**
 * Simple controller used solely for health checks.  Exposes `/health` and
 * the root `/` path to return a 200 OK status.  Railway will hit
 * `/health` as configured in railway.json to verify the service is up.
 */
@Controller()
export class HealthController {
  @Get()
  root() {
    return { status: 'ok' };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}