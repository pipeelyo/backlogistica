import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { VAR } from '../../configuracion/variable.keys';
import { VariablesService } from '../../configuracion/variables.service';
import { ROL_ID_REPARTIDOR } from '../../logistica/logistica-rol.constants';
import type { SupabaseJwtPayload } from './supabase-jwt.guard';

@Injectable()
export class RepartidorRoleGuard implements CanActivate {
  constructor(
    private readonly variables: VariablesService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: SupabaseJwtPayload }>();
    const sub = req.user?.sub?.trim();
    if (!sub) {
      throw new ForbiddenException('Sesión inválida.');
    }

    const idRol = await this.variables.getInt(VAR.ASIGNACION_ROL_REPARTIDOR_ID, ROL_ID_REPARTIDOR, {
      min: 1,
    });

    const rows = (await this.dataSource.query(
      `select 1 from usuario_rol where id_usuario = $1::uuid and id_rol = $2::int limit 1`,
      [sub, idRol],
    )) as unknown[];

    if (rows.length === 0) {
      throw new ForbiddenException('Solo usuarios con rol REPARTIDOR pueden usar esta ruta.');
    }
    return true;
  }
}
