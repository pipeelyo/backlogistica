import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class PutPedidoBodyDto {
  @ApiProperty({ example: 'GUA-001-2026' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  numGuia!: string;

  @ApiProperty({ format: 'uuid', description: 'FK `tipo_pedido`' })
  @IsUUID()
  idTipoPedido!: string;

  @ApiProperty({ format: 'uuid', description: 'FK `usuarios` (solicitante)' })
  @IsUUID()
  idUsuarioSolicitud!: string;

  @ApiPropertyOptional({
    format: 'uuid',
    nullable: true,
    description: 'FK `usuarios` (recolector)',
  })
  @IsOptional()
  @IsUUID()
  idUsuarioRecolector?: string | null;

  @ApiPropertyOptional({
    format: 'uuid',
    nullable: true,
    description: 'FK `usuarios` (repartidor)',
  })
  @IsOptional()
  @IsUUID()
  idUsuarioRepartidor?: string | null;

  @ApiProperty({ format: 'uuid', description: 'FK `metodo_recepcion`' })
  @IsUUID()
  idMetodoRecepcion!: string;

  @ApiProperty({ format: 'uuid', description: 'FK `paquete`' })
  @IsUUID()
  idPaquete!: string;

  @ApiProperty({ format: 'uuid', description: 'FK `direccion`' })
  @IsUUID()
  idDireccion!: string;

  @ApiProperty({ format: 'uuid', description: 'FK `estado_pedido`' })
  @IsUUID()
  idEstadoPedido!: string;

  @ApiPropertyOptional({
    description: 'Momento de creación (ISO 8601). Si se omite, el servidor usa `now()`.',
    example: '2026-05-06T12:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601({ strict: true })
  creadoEn?: string;
}
