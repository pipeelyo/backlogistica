import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { Request } from 'express';
import { DataSource } from 'typeorm';
import { ROL_ID_ADMINISTRADOR } from '../../logistica/logistica-rol.constants';
import type { SupabaseJwtPayload } from './supabase-jwt.guard';

@Injectable()
export class AdministradorRoleGuard implements CanActivate {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: SupabaseJwtPayload }>();
    const sub = req.user?.sub?.trim();
    if (!sub) {
      throw new ForbiddenException('Sesión inválida.');
    }

    const rows = (await this.dataSource.query(
      `select 1
       from usuario_rol ur
       inner join usuarios u on u.id_usuario = ur.id_usuario
       where u.auth_user_id = $1::uuid and ur.id_rol = $2::int
       limit 1`,
      [sub, ROL_ID_ADMINISTRADOR],
    )) as unknown[];

    if (rows.length === 0) {
      throw new ForbiddenException('Solo usuarios con rol ADMINISTRADOR pueden usar esta ruta.');
    }
    return true;
  }
}
