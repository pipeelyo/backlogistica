import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ROL_ID_REPARTIDOR } from '../../../logistica-rol.constants';

export class ListUsuariosAdminQueryDto {
  @ApiPropertyOptional({ description: 'Nombre, apellido, correo o documento', example: 'maria' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    type: 'integer',
    description: 'Filtra usuarios que tengan este `rol.id_rol`. Ver GET /catalogo/roles.',
    example: ROL_ID_REPARTIDOR,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idRol?: number;

  @ApiPropertyOptional({ type: 'integer', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ type: 'integer', default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
