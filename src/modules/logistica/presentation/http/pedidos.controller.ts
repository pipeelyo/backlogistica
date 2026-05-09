import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetPedidoByIdUseCase } from '../../application/get-pedido-by-id.use-case';
import { ListPedidosUseCase } from '../../application/list-pedidos.use-case';
import { PedidoListadoSchema } from '../../../../swagger/schemas/pedido-listado.schema';
import { ListPedidosQueryDto } from './dto/list-pedidos.query.dto';

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
      'Devuelve pedidos con tipo, estado, método, usuarios, paquete y dirección **solo como nombres** (texto). ' +
      'Opcional: `?fecha=YYYY-MM-DD` filtra por día de `creado_en` en **UTC**.',
  })
  @ApiQuery({
    name: 'fecha',
    required: false,
    example: '2026-05-02',
    description:
      'Día calendario en UTC (`YYYY-MM-DD`). Si no se envía, se listan todos los pedidos.',
  })
  @ApiOkResponse({ type: PedidoListadoSchema, isArray: true })
  list(@Query() query: ListPedidosQueryDto) {
    return this.listPedidos.execute(query.fecha ? { fecha: query.fecha } : undefined);
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
