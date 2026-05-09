import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class ListPedidosQueryDto {
  @ApiPropertyOptional({
    description:
      'Filtra por día de creación en **UTC** (`creado_en`), formato `YYYY-MM-DD`. Sin este parámetro se listan todos.',
    example: '2026-05-02',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fecha debe ser YYYY-MM-DD (día calendario en UTC)',
  })
  fecha?: string;
}
