import { BadRequestException } from '@nestjs/common';
import type { EntityManager } from 'typeorm';
import { QueryFailedError } from 'typeorm';
import { ROL_ID_ADMINISTRADOR, ROL_ID_CLIENTE } from '../../logistica-rol.constants';
import { UsuarioOrmEntity } from './usuario.orm-entity';
import { UsuarioRolOrmEntity } from './usuario-rol.orm-entity';

async function countRoles(manager: EntityManager, idUsuario: number, idsRol: number[]): Promise<number> {
  try {
    return manager
      .getRepository(UsuarioRolOrmEntity)
      .createQueryBuilder('ur')
      .where('ur.id_usuario = :id', { id: idUsuario })
      .andWhere('ur.id_rol IN (:...ids)', { ids: idsRol })
      .getCount();
  } catch (e) {
    if (e instanceof QueryFailedError) {
      const code = (e.driverError as { code?: string } | undefined)?.code;
      const pgMsg = String((e.driverError as { message?: string } | undefined)?.message ?? e.message);
      if (code === '42703' || code === '42P01') {
        throw new BadRequestException(
          `No se pudo validar roles en usuario_rol: ${pgMsg}. ` +
            'Compruebe que existan las tablas `usuario_rol` y `rol`.',
        );
      }
    }
    throw e;
  }
}

export async function usuarioEsAdministrador(manager: EntityManager, idUsuario: number): Promise<boolean> {
  return (await countRoles(manager, idUsuario, [ROL_ID_ADMINISTRADOR])) > 0;
}

/** Usuario existente con rol Cliente o Administrador. */
export async function cargarUsuarioClienteOAdministrador(
  manager: EntityManager,
  idUsuario: number,
): Promise<UsuarioOrmEntity> {
  const usuario = await manager.getRepository(UsuarioOrmEntity).findOne({
    where: { idUsuario },
  });
  if (!usuario) {
    throw new BadRequestException(
      `Usuario no encontrado: ${idUsuario}. Regístrese con POST /auth/register o revise GET /auth/me.`,
    );
  }
  const conRolPermitido = await countRoles(manager, idUsuario, [ROL_ID_CLIENTE, ROL_ID_ADMINISTRADOR]);
  if (conRolPermitido === 0) {
    throw new BadRequestException(
      `El usuario debe tener rol Cliente o Administrador (id_usuario=${idUsuario}).`,
    );
  }
  return usuario;
}
