import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ROL_ID_REPARTIDOR } from '../../../logistica-rol.constants';

export class ActualizarRolesUsuarioBodyDto {
  @ApiProperty({
    type: [Number],
    example: [ROL_ID_REPARTIDOR],
    description:
      'Reemplaza todos los roles del usuario. IDs de **GET /catalogo/roles** (1=Cliente, 2=Repartidor, 3=Administrador, 4=Supervisor).',
  })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  idsRol!: number[];
}
