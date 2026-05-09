import { ApiProperty } from '@nestjs/swagger';

/** Respuesta JSON de `GET /health` cuando `Accept: application/json`. */
export class HealthJsonSchema {
  @ApiProperty({ enum: ['ok'] })
  status!: 'ok';

  @ApiProperty({ example: '2026-05-09T21:05:52.750Z' })
  timestamp!: string;
}
