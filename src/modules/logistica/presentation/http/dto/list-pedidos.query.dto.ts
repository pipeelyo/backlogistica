import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

export class ListPedidosQueryDto {
  @ApiPropertyOptional({
    description:
      'Filtra por día de `creado_en` (formato `YYYY-MM-DD`). Por defecto el día es **civil en Colombia** (`America/Bogota`, UTC−5). ' +
      'Para filtrar por día **UTC** ponga en el servidor `LIST_PEDIDOS_FECHA_TZ=UTC`. Sin `fecha` se listan todos.',
    example: '2026-05-10',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fecha debe ser YYYY-MM-DD',
  })
  fecha?: string;
}
