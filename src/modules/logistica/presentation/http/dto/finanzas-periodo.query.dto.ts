import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class FinanzasPeriodoQueryDto {
  @ApiPropertyOptional({
    description:
      'Inicio del periodo (día civil Colombia, `YYYY-MM-DD`). Default: primer día del mes actual.',
    example: '2026-05-01',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fechaDesde debe ser YYYY-MM-DD' })
  fechaDesde?: string;

  @ApiPropertyOptional({
    description: 'Fin del periodo (`YYYY-MM-DD`, inclusive). Default: hoy en Colombia.',
    example: '2026-05-23',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fechaHasta debe ser YYYY-MM-DD' })
  fechaHasta?: string;
}
