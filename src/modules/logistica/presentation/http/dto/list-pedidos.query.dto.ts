import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, Matches } from 'class-validator';

export class ListPedidosQueryDto {
  @ApiPropertyOptional({
    description: 'Filtra por dia de creado_en (formato YYYY-MM-DD).',
    example: '2026-05-10',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe ser YYYY-MM-DD' })
  fecha?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filtra pedidos por id_usuario del solicitante.',
    example: 'e76e25c1-94dc-4ec8-b95d-f292b664d859',
  })
  @IsOptional()
  @IsUUID()
  idUsuario?: string;
}