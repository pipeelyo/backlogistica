import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Matches, Max, Min } from 'class-validator';

export class ListTransaccionesRecientesQueryDto {
  @ApiPropertyOptional({
    type: 'integer',
    default: 5,
    minimum: 1,
    maximum: 50,
    description: 'Cantidad de filas (dashboard: 5; enlace "Ver todo": subir a 50).',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filtra por día de creación de la factura (inicio, Colombia).',
    example: '2026-05-01',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fechaDesde debe ser YYYY-MM-DD' })
  fechaDesde?: string;

  @ApiPropertyOptional({
    description: 'Filtra por día de creación de la factura (fin inclusive, Colombia).',
    example: '2026-05-23',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fechaHasta debe ser YYYY-MM-DD' })
  fechaHasta?: string;
}
