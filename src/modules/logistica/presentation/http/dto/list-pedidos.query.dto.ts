import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, Matches } from 'class-validator';

export class ListPedidosQueryDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Devuelve **como máximo un** pedido con ese `pedidos.id_pedido` (array de 0 o 1 elemento). ' +
      'Para un solo objeto y 404 si no existe, use **GET /pedidos/{id}**.',
    example: '7f6ca7e7-c7b0-48ef-94aa-805efeec41b9',
  })
  @IsOptional()
  @IsUUID()
  idPedido?: string;

  @ApiPropertyOptional({
    description: 'Filtra por día de `creado_en` (formato YYYY-MM-DD). No combinable con `idPedido`.',
    example: '2026-05-10',
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe ser YYYY-MM-DD' })
  fecha?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filtra pedidos por `usuarios.id_usuario` del solicitante.',
    example: 'e76e25c1-94dc-4ec8-b95d-f292b664d859',
  })
  @IsOptional()
  @IsUUID()
  idUsuario?: string;
}