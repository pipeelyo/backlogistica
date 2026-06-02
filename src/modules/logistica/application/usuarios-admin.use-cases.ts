import { Inject, Injectable } from '@nestjs/common';
import type { UsuarioAdminPort } from '../domain/read-models/usuario-admin-listado';
import { USUARIO_ADMIN } from '../usuarios-admin.tokens';
import type { ActualizarRolesUsuarioBodyDto } from '../presentation/http/dto/actualizar-roles-usuario.body.dto';
import type { ListUsuariosAdminQueryDto } from '../presentation/http/dto/list-usuarios-admin.query.dto';

@Injectable()
export class ListUsuariosAdminUseCase {
  constructor(@Inject(USUARIO_ADMIN) private readonly usuarios: UsuarioAdminPort) {}

  execute(query: ListUsuariosAdminQueryDto) {
    return this.usuarios.listUsuarios({
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      ...(query.search?.trim() && { search: query.search.trim() }),
      ...(query.idRol != null && { idRol: query.idRol }),
    });
  }
}

@Injectable()
export class ActualizarRolesUsuarioUseCase {
  constructor(@Inject(USUARIO_ADMIN) private readonly usuarios: UsuarioAdminPort) {}

  execute(idUsuario: number, body: ActualizarRolesUsuarioBodyDto) {
    return this.usuarios.actualizarRolesUsuario(idUsuario, body.idsRol);
  }
}
