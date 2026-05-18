import { ApiProperty } from '@nestjs/swagger';

export class ResultadoEntregaCatalogoSchema {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Entregado con éxito' })
  nombre!: string;

  @ApiProperty({ enum: ['EXITO', 'NOVEDADES', 'NO_ENTREGADO', 'RECHAZADO'] })
  codigo!: string;
}
