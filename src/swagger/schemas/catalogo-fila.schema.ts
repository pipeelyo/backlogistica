import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Fila típica de catálogos (`/catalogo/*`). */
export class CatalogoFilaSchema {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional({ description: 'País, departamento o ciudad' })
  codigoDane?: string;

  @ApiPropertyOptional({ description: 'Solo en tipo documento' })
  abreviacion?: string;
}
