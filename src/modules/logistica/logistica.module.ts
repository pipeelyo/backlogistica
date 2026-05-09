import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListCiudadesUseCase } from './application/list-ciudades.use-case';
import { ListDepartamentosUseCase } from './application/list-departamentos.use-case';
import { ListEstadosPedidoUseCase } from './application/list-estados-pedido.use-case';
import { ListMetodosRecepcionUseCase } from './application/list-metodos-recepcion.use-case';
import { ListPaisesUseCase } from './application/list-paises.use-case';
import { GetPedidoByIdUseCase } from './application/get-pedido-by-id.use-case';
import { ListPedidosUseCase } from './application/list-pedidos.use-case';
import { CreatePedidoUseCase } from './application/create-pedido.use-case';
import { ListRolesUseCase } from './application/list-roles.use-case';
import { ListTiposDocumentoUseCase } from './application/list-tipos-documento.use-case';
import { ListTiposPedidoUseCase } from './application/list-tipos-pedido.use-case';
import { ListTiposViaUseCase } from './application/list-tipos-via.use-case';
import { CATALOG_READ } from './catalog.tokens';
import { TypeOrmCatalogReadRepository } from './infrastructure/persistence/typeorm-catalog-read.repository';
import { TypeOrmPedidoReadRepository } from './infrastructure/persistence/typeorm-pedido-read.repository';
import { TypeOrmPedidoWriteRepository } from './infrastructure/persistence/typeorm-pedido-write.repository';
import { LOGISTICA_TYPEORM_ENTITIES } from './logistica.persistence.entities';
import { PEDIDO_READ, PEDIDO_WRITE } from './pedidos.tokens';
import { CatalogoController } from './presentation/http/catalogo.controller';
import { PedidosController } from './presentation/http/pedidos.controller';

/**
 * Bounded context logística: catálogos, lectura de pedidos y mapa ORM.
 */
@Module({
  imports: [TypeOrmModule.forFeature([...LOGISTICA_TYPEORM_ENTITIES])],
  controllers: [CatalogoController, PedidosController],
  providers: [
    TypeOrmCatalogReadRepository,
    { provide: CATALOG_READ, useExisting: TypeOrmCatalogReadRepository },
    TypeOrmPedidoReadRepository,
    { provide: PEDIDO_READ, useExisting: TypeOrmPedidoReadRepository },
    TypeOrmPedidoWriteRepository,
    { provide: PEDIDO_WRITE, useExisting: TypeOrmPedidoWriteRepository },
    ListPaisesUseCase,
    ListDepartamentosUseCase,
    ListCiudadesUseCase,
    ListEstadosPedidoUseCase,
    ListRolesUseCase,
    ListTiposPedidoUseCase,
    ListMetodosRecepcionUseCase,
    ListTiposDocumentoUseCase,
    ListTiposViaUseCase,
    ListPedidosUseCase,
    GetPedidoByIdUseCase,
    CreatePedidoUseCase,
  ],
  exports: [TypeOrmModule],
})
export class LogisticaModule {}
