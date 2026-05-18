import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Esquema OpenAPI del JSON de `GET /pedidos` (relaciones resueltas solo como texto). */
export class PedidoListadoSchema {
  @ApiProperty({ format: 'uuid' })
  idPedido!: string;

  @ApiProperty({ example: 'GUA-001-2024' })
  numGuia!: string;

  @ApiProperty({ example: '2026-05-02T18:49:07.288Z' })
  creadoEn!: string;

  @ApiProperty({ description: 'Nombre del tipo de pedido' })
  tipoPedido!: string;

  @ApiPropertyOptional({
    enum: ['DESPACHO', 'RECOLECCION'],
    nullable: true,
    description: 'Despacho vs recolección inferido de `metodo_recepcion`',
  })
  tipoOperacion!: 'DESPACHO' | 'RECOLECCION' | null;

  @ApiProperty({ example: '2026-05-20', description: 'Día programado de entrega' })
  fechaEntrega!: string;

  @ApiProperty({ description: 'Nombre del estado' })
  estadoPedido!: string;

  @ApiProperty({ description: 'Nombre del método de recepción' })
  metodoRecepcion!: string;

  @ApiProperty({ description: 'Nombre completo del usuario solicitante' })
  usuarioSolicitud!: string;

  @ApiPropertyOptional({ description: 'Nombre completo del recolector', nullable: true })
  usuarioRecolector!: string | null;

  @ApiPropertyOptional({ description: 'Nombre completo del repartidor', nullable: true })
  usuarioRepartidor!: string | null;

  @ApiProperty({ description: 'Nombre del paquete' })
  paquete!: string;

  @ApiProperty({
    description:
      'Dirección legible: ciudad, departamento y nomenclatura urbana CO (`tipo` + `zona` antes del `#` + placas).',
    example: 'Bogotá, Bogotá D.C., Calle 11b # 15-40, Torre norte, apto 502',
  })
  direccion!: string;

  @ApiPropertyOptional({ nullable: true })
  destinatarioNombre!: string | null;

  @ApiPropertyOptional({ nullable: true })
  destinatarioTelefono!: string | null;

  @ApiProperty()
  fragil!: boolean;

  @ApiPropertyOptional({
    nullable: true,
    description:
      'Texto del manifiesto (Storage `manifiesto.txt` si lo envió en el POST; `null` si no hay).',
    example:
      'Manipular con cuidado, llamar al recibir al número indicado en la etiqueta. Mercancía frágil.',
  })
  observacionesManifiesto!: string | null;

  @ApiPropertyOptional({ type: [String], nullable: true })
  fotosPaqueteUrls!: string[] | null;
}
