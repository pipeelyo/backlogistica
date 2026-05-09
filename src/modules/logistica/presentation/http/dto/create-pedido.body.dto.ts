import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

/** Cuerpo de `POST /pedidos` — sin repetir datos del cliente: se envía solo `idCliente` (tabla `cliente`). */
export class CreatePedidoBodyDto {
  @ApiProperty({
    format: 'uuid',
    description:
      'Id del registro en tabla `cliente` (empresa + `fk_usuario`). Documento y tipo están en `usuarios`.',
  })
  @IsUUID()
  idCliente!: string;

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

  @ApiProperty({ example: 'Calle', description: 'Debe existir en catálogo `tipo_via` (nombre).' })
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  tipoViaNombre!: string;

  @ApiProperty({ example: '72', description: 'Nombre o número de la vía' })
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
    example: 'Bogotá',
    description: 'Nombre de ciudad (coincidencia exacta con el catálogo, sin importar mayúsculas)',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  ciudadNombre!: string;

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

  @ApiPropertyOptional({ description: 'Observaciones del manifiesto' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  observacionesManifiesto?: string;

  @ApiPropertyOptional({
    description: 'URLs de fotos del paquete (opcional)',
    type: [String],
    maxItems: 8,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  fotosPaqueteUrls?: string[];
}
