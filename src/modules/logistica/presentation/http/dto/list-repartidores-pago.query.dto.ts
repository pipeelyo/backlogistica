import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class ListRepartidoresPagoQueryDto {
  @ApiPropertyOptional({ description: 'Nombre, documento o código RP-8842', example: 'Juan' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['ocupado', 'libre'], description: 'Filtra por pedidos activos en `fecha`' })
  @IsOptional()
  @IsIn(['ocupado', 'libre'])
  estado?: 'ocupado' | 'libre';

  @ApiPropertyOptional({
    description: 'Día para calcular estado ocupado/libre (default: hoy Colombia)',
    example: '2026-05-23',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  fecha?: string;

  @ApiPropertyOptional({ type: 'integer', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ type: 'integer', default: 4, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
