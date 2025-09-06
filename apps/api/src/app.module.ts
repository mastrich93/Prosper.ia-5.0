import { Module } from '@nestjs/common';
import { LeadsModule } from './modules/leads/leads.module';
import { HealthController } from './health.controller';

@Module({
  imports: [LeadsModule],
  // Register the health controller so that the API exposes `/health` and `/`.
  controllers: [HealthController],
})
export class AppModule {}