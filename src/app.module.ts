import { Module } from '@nestjs/common';
import { ExampleModule } from './modules/example/example.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [HealthModule, ExampleModule],
})
export class AppModule {}
