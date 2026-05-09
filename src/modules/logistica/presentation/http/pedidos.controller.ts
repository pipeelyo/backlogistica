import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetPedidoByIdUseCase } from '../../application/get-pedido-by-id.use-case';
import { ListPedidosUseCase } from '../../application/list-pedidos.use-case';
import { PutPedidoUseCase } from '../../application/put-pedido.use-case';
import { PedidoListadoSchema } from '../../../../swagger/schemas/pedido-listado.schema';
import { ListPedidosQueryDto } from './dto/list-pedidos.query.dto';
import { PutPedidoBodyDto } from './dto/put-pedido.body.dto';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly listPedidos: ListPedidosUseCase,
    private readonly getPedidoById: GetPedidoByIdUseCase,
    private readonly putPedido: PutPedidoUseCase,
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

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear pedido',
    description:
      'Crea un pedido cuyo `id_pedido` es el UUID de la ruta. Debe enviar las FK existentes (tipo, usuarios, método, paquete, dirección, estado). ' +
      'Si ese id ya existe → **409 Conflict**. Si alguna FK no existe → **400**.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Será el `id_pedido` del nuevo registro' })
  @ApiBody({ type: PutPedidoBodyDto })
  @ApiCreatedResponse({
    type: PedidoListadoSchema,
    description: 'Pedido creado (mismo formato que en GET)',
  })
  @ApiConflictResponse({ description: 'Ya existe un pedido con ese id' })
  @ApiBadRequestResponse({ description: 'FK inexistente u otro error de validación de datos' })
  crear(@Param('id', ParseUUIDPipe) id: string, @Body() body: PutPedidoBodyDto) {
    return this.putPedido.execute(id, body);
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
