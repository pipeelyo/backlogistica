import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PEDIDO_TIPO_OPERACION } from '../../../domain/pedido-tipo-operacion';
import { EJEMPLO_FOTO_PAQUETE_DATA_URL } from '../ejemplo-foto-paquete.data-url';

/** Cuerpo de `POST /pedidos` — solicitante con rol CLIENTE o ADMIN. */
export class CreatePedidoBodyDto {
  @ApiProperty({
    format: 'uuid',
    example: 'b0829465-0779-4366-a29a-6feb6c88cbba',
    description:
      '`usuarios.id_usuario` del solicitante; en `usuario_rol` debe tener rol **CLIENTE** o **ADMIN** (`rol.nombre`, sin importar mayúsculas).',
  })
  @IsUUID()
  idUsuario!: string;

  @ApiProperty({
    enum: PEDIDO_TIPO_OPERACION,
    description:
      '**DESPACHO**: entrega al destinatario. **RECOLECCION**: recogida en origen. Debe existir un `tipo_pedido` cuyo nombre encaje (ej. "Despacho", "Recolección").',
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
    example: '72',
    description:
      'Identificador de la vía (número/nombre); se compone en `direccion.zona` junto al tipo. El tipo en BD es solo `fk_tipo_via`.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  nombreVia!: string;

  @ApiProperty({ example: '15', description: 'Primer número del # (placa principal)' })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  numeroPlaca!: string;

  @ApiProperty({ example: '40', description: 'Segundo número del #' })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  numeroSecundario!: string;

  @ApiProperty({
    format: 'uuid',
    example: '2539dd69-aee5-4fa7-ab4c-d7838acc89e6',
    description: '`ciudad.id_ciudad` del catálogo (p. ej. Bogotá).',
  })
  @IsUUID()
  idCiudad!: string;

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
