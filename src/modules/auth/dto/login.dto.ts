import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'maria@ejemplo.com' })
  @IsEmail()
  @MaxLength(254)
  correo!: string;

  @ApiProperty({ example: 'SecretaSegura1', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
