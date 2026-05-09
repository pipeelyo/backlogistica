import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetPedidoByIdUseCase } from '../../application/get-pedido-by-id.use-case';
import { ListPedidosUseCase } from '../../application/list-pedidos.use-case';
import { PedidoListadoSchema } from '../../../../swagger/schemas/pedido-listado.schema';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly listPedidos: ListPedidosUseCase,
    private readonly getPedidoById: GetPedidoByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar pedidos',
    description:
      'Devuelve pedidos con tipo, estado, método, usuarios, paquete y dirección **solo como nombres** (texto), no objetos completos.',
  })
  @ApiOkResponse({ type: PedidoListadoSchema, isArray: true })
  list() {
    return this.listPedidos.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pedido por id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'id_pedido' })
  @ApiOkResponse({ type: PedidoListadoSchema })
  @ApiNotFoundResponse({ description: 'Pedido no encontrado' })
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getPedidoById.execute(id);
  }
}
