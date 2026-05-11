import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ROL_ID_CLIENTE, TIPO_DOCUMENTO_ID_REGISTRO } from '../auth.constants';

export class RegisterDto {
  @ApiProperty({ example: 'maria@ejemplo.com' })
  @IsEmail()
  @MaxLength(254)
  correo!: string;

  @ApiProperty({ example: 'SecretaSegura1', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;

  @ApiProperty({ example: 'María' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  nombres!: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  apellidos!: string;

  @ApiProperty({
    format: 'uuid',
    description: '`tipo_documento.id_tipo_documento`',
    example: TIPO_DOCUMENTO_ID_REGISTRO,
  })
  @IsUUID()
  fkTipoDocumento!: string;

  @ApiProperty({ example: '1020304050' })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  documento!: string;

  @ApiProperty({ example: '3001234567' })
  @IsString()
  @MinLength(7)
  @MaxLength(32)
  telefono!: string;

  @ApiProperty({
    format: 'uuid',
    description: '`rol.id_rol` del usuario en la tabla `rol`.',
    example: ROL_ID_CLIENTE,
  })
  @IsUUID()
  idRol!: string;
}
