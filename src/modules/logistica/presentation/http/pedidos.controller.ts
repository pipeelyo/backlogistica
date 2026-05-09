import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePedidoUseCase } from '../../application/create-pedido.use-case';
import { GetPedidoByIdUseCase } from '../../application/get-pedido-by-id.use-case';
import { ListPedidosUseCase } from '../../application/list-pedidos.use-case';
import { PedidoListadoSchema } from '../../../../swagger/schemas/pedido-listado.schema';
import { CreatePedidoBodyDto } from './dto/create-pedido.body.dto';
import { ListPedidosQueryDto } from './dto/list-pedidos.query.dto';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly listPedidos: ListPedidosUseCase,
    private readonly createPedido: CreatePedidoUseCase,
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear pedido',
    description:
      'Crea un pedido. El **`id_pedido` (UUID) lo genera el backend**; la respuesta incluye ese id junto con el resto del listado legible. ' +
      'Debe enviar FK existentes (tipo, usuarios, método, paquete, dirección, estado). Si alguna FK no existe → **400**.',
  })
  @ApiBody({ type: CreatePedidoBodyDto })
  @ApiCreatedResponse({
    type: PedidoListadoSchema,
    description: 'Pedido creado; `idPedido` es el UUID asignado por el servidor',
  })
  @ApiBadRequestResponse({ description: 'FK inexistente u otro error de validación de datos' })
  crear(@Body() body: CreatePedidoBodyDto) {
    return this.createPedido.execute(body);
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
