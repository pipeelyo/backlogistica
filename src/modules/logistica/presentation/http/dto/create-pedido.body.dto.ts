import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PEDIDO_TIPO_OPERACION } from '../../../domain/pedido-tipo-operacion';
import { TIPO_PEDIDO_ID_NORMAL } from '../../../logistica-tipo-pedido.constants';
import { EJEMPLO_FOTO_PAQUETE_DATA_URL } from '../ejemplo-foto-paquete.data-url';

/** Cuerpo de `POST /pedidos` — solicitante con rol Cliente o Administrador. */
export class CreatePedidoBodyDto {
  @ApiProperty({
    format: 'uuid',
    example: 'b0829465-0779-4366-a29a-6feb6c88cbba',
    description:
      '`usuarios.id_usuario` del solicitante; en `usuario_rol` debe tener rol **Cliente** o **Administrador** (`rol.nombre`, sin importar mayúsculas).',
  })
  @IsUUID()
  idUsuario!: string;

  @ApiProperty({
    type: 'integer',
    example: TIPO_PEDIDO_ID_NORMAL,
    description:
      '`tipo_pedido.id_tipo_pedido` (ej. 1=Normal, 2=Express). Ver **GET /catalogo/tipos-pedido**.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTipoPedido!: number;

  @ApiProperty({
    example: '2026-05-20',
    description: 'Día programado de entrega (`pedidos.fecha_entrega`, formato `YYYY-MM-DD`).',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fechaEntrega debe ser YYYY-MM-DD' })
  fechaEntrega!: string;

  @ApiProperty({
    enum: PEDIDO_TIPO_OPERACION,
    description:
      '**DESPACHO**: entrega en dirección (`metodo_recepcion` ≈ Entrega). **RECOLECCION**: recogida (`metodo_recepcion` ≈ Recogida).',
    example: 'DESPACHO',
  })
  @IsIn([...PEDIDO_TIPO_OPERACION])
  tipoOperacion!: (typeof PEDIDO_TIPO_OPERACION)[number];

  @ApiProperty({ example: 'María Pérez' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  nombreDestinatario!: string;

  @ApiProperty({ example: '3001234567' })
  @IsString()
  @MinLength(7)
  @MaxLength(32)
  telefonoDestinatario!: string;

  @ApiProperty({
    example: 'Calle',
    description:
      'Nombre exacto del registro en catálogo **`tipo_via`** (mismo que `GET /catalogo/tipos-via`, ej. Calle, Carrera).',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  tipoViaNombre!: string;

  @ApiProperty({
    example: '11b',
    description:
      'Número de vía **antes** del `#` en nomenclatura colombiana; se guarda en `direccion.zona` (p. ej. `2A`, `11b`).',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  nombreVia!: string;

  @ApiProperty({ example: '15', description: 'Placa principal **después** del `#` (`direccion.numero_principal`)' })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  numeroPlaca!: string;

  @ApiProperty({ example: '40', description: 'Placa secundaria **después** del `#` (`direccion.numero_secundario`)' })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  numeroSecundario!: string;

  @ApiProperty({
    type: 'integer',
    example: 1,
    description: '`ciudad.id_ciudad` numérico del catálogo (`GET /catalogo/ciudades`).',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idCiudad!: number;

  @ApiProperty({
    format: 'uuid',
    example: '89f50dc7-12f4-4c39-b142-0e5bff7841a3',
    description:
      '`departamento.id_departamento` para `direccion.fk_departamento` (la tabla `ciudad` no tiene FK al departamento).',
  })
  @IsUUID()
  idDepartamento!: string;

  @ApiProperty({
    format: 'uuid',
    example: '4d26c814-c04e-4e53-9929-d42a86a5eafd',
    description:
      '`pais.id_pais` para `direccion.fk_pais` (el departamento no tiene FK a país en BD). Ejemplo: Colombia.',
  })
  @IsUUID()
  idPais!: string;

  @ApiPropertyOptional({
    example: 'Torre norte, apto 502',
    description: 'Observaciones de entrega (apto, portería, etc.)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacionesDireccion?: string;

  @ApiProperty({
    example: 'Electrónicos',
    description: 'Nombre descriptivo del contenido / tipo de producto',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  tipoProductoNombre!: string;

  @ApiProperty({ example: 2.5, description: 'Peso en kilogramos' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pesoKg!: number;

  @ApiProperty({
    example: 1500000,
    description: 'Valor declarado (se guarda en el registro de paquete)',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valorDeclarado!: number;

  @ApiProperty({ description: 'Indicador frágil' })
  @Type(() => Boolean)
  @IsBoolean()
  fragil!: boolean;

  @ApiPropertyOptional({
    description:
      'Observaciones del manifiesto (se guardan en Storage como `pedidos/{id}/manifiesto.txt` y aparecen en GET list/detail).',
    example:
      'Manipular con cuidado, llamar al recibir al número indicado en la etiqueta. Mercancía frágil.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observacionesManifiesto?: string;

  @ApiPropertyOptional({
    description:
      'URLs `https` de fotos ya alojadas (opcional). Combinado con `fotosPaqueteBase64`, máximo 8 ítems en total.',
    type: [String],
    maxItems: 8,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  fotosPaqueteUrls?: string[];

  @ApiPropertyOptional({
    description:
      'Fotos en base64 (`data:image/jpeg;base64,...` o similar). Se suben al bucket Supabase **`evidencias`** (`pedidos/{id}/…`). Requiere `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en el servidor.',
    type: [String],
    maxItems: 8,
    example: [EJEMPLO_FOTO_PAQUETE_DATA_URL],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(13_500_000, { each: true })
  fotosPaqueteBase64?: string[];
}
