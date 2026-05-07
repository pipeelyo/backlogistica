import { Controller, Get } from '@nestjs/common';
import { CheckHealthUseCase } from '../../application/check-health.use-case';

@Controller('health')
export class HealthController {
  constructor(private readonly checkHealth: CheckHealthUseCase) {}

  @Get()
  getHealth() {
    return this.checkHealth.execute();
  }
}
