import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListCiudadesUseCase } from '../../application/list-ciudades.use-case';
import { ListDepartamentosUseCase } from '../../application/list-departamentos.use-case';
import { ListEstadosPedidoUseCase } from '../../application/list-estados-pedido.use-case';
import { ListMetodosRecepcionUseCase } from '../../application/list-metodos-recepcion.use-case';
import { ListPaisesUseCase } from '../../application/list-paises.use-case';
import { ListRolesUseCase } from '../../application/list-roles.use-case';
import { ListTiposDocumentoUseCase } from '../../application/list-tipos-documento.use-case';
import { ListTiposPedidoUseCase } from '../../application/list-tipos-pedido.use-case';
import { ListTiposViaUseCase } from '../../application/list-tipos-via.use-case';
import { CatalogoFilaSchema } from '../../../../swagger/schemas/catalogo-fila.schema';

@ApiTags('Catálogo')
@Controller('catalogo')
export class CatalogoController {
  constructor(
    private readonly listPaises: ListPaisesUseCase,
    private readonly listDepartamentos: ListDepartamentosUseCase,
    private readonly listCiudades: ListCiudadesUseCase,
    private readonly listEstadosPedido: ListEstadosPedidoUseCase,
    private readonly listRoles: ListRolesUseCase,
    private readonly listTiposPedido: ListTiposPedidoUseCase,
    private readonly listMetodosRecepcion: ListMetodosRecepcionUseCase,
    private readonly listTiposDocumento: ListTiposDocumentoUseCase,
    private readonly listTiposVia: ListTiposViaUseCase,
  ) {}

  @Get('paises')
  @ApiOperation({ summary: 'Listar países' })
  @ApiOkResponse({ type: CatalogoFilaSchema, isArray: true })
  paises() {
    return this.listPaises.execute();
  }

  @Get('departamentos')
  @ApiOperation({ summary: 'Listar departamentos' })
  @ApiOkResponse({ type: CatalogoFilaSchema, isArray: true })
  departamentos() {
    return this.listDepartamentos.execute();
  }

  @Get('ciudades')
  @ApiOperation({ summary: 'Listar ciudades' })
  @ApiOkResponse({ type: CatalogoFilaSchema, isArray: true })
  ciudades() {
    return this.listCiudades.execute();
  }

  @Get('estados-pedido')
  @ApiOperation({ summary: 'Listar estados de pedido' })
  @ApiOkResponse({ type: CatalogoFilaSchema, isArray: true })
  estadosPedido() {
    return this.listEstadosPedido.execute();
  }

  @Get('roles')
  @ApiOperation({ summary: 'Listar roles (tabla rol)' })
  @ApiOkResponse({ type: CatalogoFilaSchema, isArray: true })
  roles() {
    return this.listRoles.execute();
  }

  @Get('tipos-pedido')
  @ApiOperation({ summary: 'Listar tipos de pedido' })
  @ApiOkResponse({ type: CatalogoFilaSchema, isArray: true })
  tiposPedido() {
    return this.listTiposPedido.execute();
  }

  @Get('metodos-recepcion')
  @ApiOperation({ summary: 'Listar métodos de recepción' })
  @ApiOkResponse({ type: CatalogoFilaSchema, isArray: true })
  metodosRecepcion() {
    return this.listMetodosRecepcion.execute();
  }

  @Get('tipos-documento')
  @ApiOperation({ summary: 'Listar tipos de documento' })
  @ApiOkResponse({ type: CatalogoFilaSchema, isArray: true })
  tiposDocumento() {
    return this.listTiposDocumento.execute();
  }

  @Get('tipos-via')
  @ApiOperation({ summary: 'Listar tipos de vía' })
  @ApiOkResponse({ type: CatalogoFilaSchema, isArray: true })
  tiposVia() {
    return this.listTiposVia.execute();
  }
}
