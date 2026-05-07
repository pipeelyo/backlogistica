import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  readonly status: 'ok';
  readonly timestamp: string;
}

@Injectable()
export class CheckHealthUseCase {
  execute(): HealthStatus {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
