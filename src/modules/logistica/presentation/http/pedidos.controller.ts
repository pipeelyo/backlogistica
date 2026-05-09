import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GetPedidoByIdUseCase } from '../../application/get-pedido-by-id.use-case';
import { ListPedidosUseCase } from '../../application/list-pedidos.use-case';

@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly listPedidos: ListPedidosUseCase,
    private readonly getPedidoById: GetPedidoByIdUseCase,
  ) {}

  @Get()
  list() {
    return this.listPedidos.execute();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.getPedidoById.execute(id);
  }
}
