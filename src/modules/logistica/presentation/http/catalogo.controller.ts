import { Controller, Get } from '@nestjs/common';
import { ListCiudadesUseCase } from '../../application/list-ciudades.use-case';
import { ListDepartamentosUseCase } from '../../application/list-departamentos.use-case';
import { ListEstadosPedidoUseCase } from '../../application/list-estados-pedido.use-case';
import { ListMetodosRecepcionUseCase } from '../../application/list-metodos-recepcion.use-case';
import { ListPaisesUseCase } from '../../application/list-paises.use-case';
import { ListRolesUseCase } from '../../application/list-roles.use-case';
import { ListTiposDocumentoUseCase } from '../../application/list-tipos-documento.use-case';
import { ListTiposPedidoUseCase } from '../../application/list-tipos-pedido.use-case';
import { ListTiposViaUseCase } from '../../application/list-tipos-via.use-case';

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
  paises() {
    return this.listPaises.execute();
  }

  @Get('departamentos')
  departamentos() {
    return this.listDepartamentos.execute();
  }

  @Get('ciudades')
  ciudades() {
    return this.listCiudades.execute();
  }

  @Get('estados-pedido')
  estadosPedido() {
    return this.listEstadosPedido.execute();
  }

  /** Roles del dominio (tabla `rol`). Si tu tabla tiene otro nombre, avisa y lo alineamos. */
  @Get('roles')
  roles() {
    return this.listRoles.execute();
  }

  @Get('tipos-pedido')
  tiposPedido() {
    return this.listTiposPedido.execute();
  }

  @Get('metodos-recepcion')
  metodosRecepcion() {
    return this.listMetodosRecepcion.execute();
  }

  @Get('tipos-documento')
  tiposDocumento() {
    return this.listTiposDocumento.execute();
  }

  @Get('tipos-via')
  tiposVia() {
    return this.listTiposVia.execute();
  }
}
