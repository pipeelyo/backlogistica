import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdministradorRoleGuard } from '../../../auth/guards/administrador-role.guard';
import { SupabaseJwtGuard } from '../../../auth/guards/supabase-jwt.guard';
import {
  ActualizarRolesUsuarioUseCase,
  ListUsuariosAdminUseCase,
} from '../../application/usuarios-admin.use-cases';
import {
  UsuarioAdminListadoPaginadoSchema,
  UsuarioAdminListadoSchema,
  USUARIO_ADMIN_LISTADO_EJEMPLO,
  USUARIO_ADMIN_LISTADO_PAGINADO_EJEMPLO,
} from '../../../../swagger/schemas/usuario-admin.schema';
import { ActualizarRolesUsuarioBodyDto } from './dto/actualizar-roles-usuario.body.dto';
import { ListUsuariosAdminQueryDto } from './dto/list-usuarios-admin.query.dto';
import { ROL_ID_ADMINISTRADOR, ROL_ID_CLIENTE, ROL_ID_REPARTIDOR } from '../../logistica-rol.constants';

@ApiTags('Admin — Usuarios')
@ApiBearerAuth('supabase-jwt')
@ApiUnauthorizedResponse({ description: 'JWT inválido o ausente' })
@ApiForbiddenResponse({ description: 'Solo rol ADMINISTRADOR' })
@UseGuards(SupabaseJwtGuard, AdministradorRoleGuard)
@Controller('admin/usuarios')
export class AdminUsuariosController {
  constructor(
    private readonly listUsuarios: ListUsuariosAdminUseCase,
    private readonly actualizarRolesUsuario: ActualizarRolesUsuarioUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios',
    description:
      'Listado paginado de `usuarios` con roles asignados (`usuario_rol`). ' +
      'Filtros: `search` (nombre, correo, documento), `idRol`. Catálogo de roles: **GET /catalogo/roles**. ' +
      'La respuesta incluye `totalPaginas` para el paginador del front.',
  })
  @ApiOkResponse({
    type: UsuarioAdminListadoPaginadoSchema,
    description: 'Listado paginado',
    schema: { example: USUARIO_ADMIN_LISTADO_PAGINADO_EJEMPLO },
  })
  list(@Query() query: ListUsuariosAdminQueryDto) {
    return this.listUsuarios.execute(query);
  }

  @Patch(':id/roles')
  @ApiOperation({
    summary: 'Actualizar roles de un usuario',
    description:
      'Reemplaza por completo los roles en `usuario_rol`. Envíe uno o más `idsRol` del catálogo **GET /catalogo/roles**.',
  })
  @ApiParam({ name: 'id', type: 'integer', example: 2, description: '`usuarios.id_usuario`' })
  @ApiBody({
    type: ActualizarRolesUsuarioBodyDto,
    examples: {
      repartidor: {
        summary: 'Asignar solo Repartidor',
        value: { idsRol: [ROL_ID_REPARTIDOR] },
      },
      administrador: {
        summary: 'Asignar solo Administrador',
        value: { idsRol: [ROL_ID_ADMINISTRADOR] },
      },
      clienteYRepartidor: {
        summary: 'Cliente + Repartidor',
        value: { idsRol: [ROL_ID_CLIENTE, ROL_ID_REPARTIDOR] },
      },
    },
  })
  @ApiOkResponse({
    type: UsuarioAdminListadoSchema,
    schema: { example: USUARIO_ADMIN_LISTADO_EJEMPLO },
  })
  @ApiBadRequestResponse({ description: 'idsRol vacío o rol inexistente' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  patchRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ActualizarRolesUsuarioBodyDto,
  ) {
    return this.actualizarRolesUsuario.execute(id, body);
  }
}
