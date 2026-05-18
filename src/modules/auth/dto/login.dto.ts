import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { SWAGGER_EJEMPLO_CORREO, SWAGGER_EJEMPLO_PASSWORD } from '../../../swagger/swagger-ejemplos';

export class LoginDto {
  @ApiProperty({ example: SWAGGER_EJEMPLO_CORREO, description: 'Correo registrado en Supabase Auth' })
  @IsEmail()
  @MaxLength(254)
  correo!: string;

  @ApiProperty({ example: SWAGGER_EJEMPLO_PASSWORD, minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
