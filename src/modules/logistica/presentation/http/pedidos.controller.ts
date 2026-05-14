import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SupabaseJwtGuard } from '../../../auth/guards/supabase-jwt.guard';
import { CreatePedidoUseCase } from '../../application/create-pedido.use-case';
import { GetPedidoByIdUseCase } from '../../application/get-pedido-by-id.use-case';
import { GetPedidoByNumGuiaUseCase } from '../../application/get-pedido-by-num-guia.use-case';
import { ListPedidosUseCase } from '../../application/list-pedidos.use-case';
import { UpdatePedidoUseCase } from '../../application/update-pedido.use-case';
import { PedidoListadoSchema } from '../../../../swagger/schemas/pedido-listado.schema';
import { CreatePedidoBodyDto } from './dto/create-pedido.body.dto';
import { ListPedidosQueryDto } from './dto/list-pedidos.query.dto';
import { UpdatePedidoBodyDto } from './dto/update-pedido.body.dto';

@ApiTags('Pedidos')
@ApiBearerAuth('supabase-jwt')
@ApiUnauthorizedResponse({
  description:
    'Falta `Authorization: Bearer <access_token>` o el JWT de Supabase es inválido/expirado. Obtenga token en POST /auth/login o POST /auth/register.',
})
@UseGuards(SupabaseJwtGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly listPedidos: ListPedidosUseCase,
    private readonly createPedido: CreatePedidoUseCase,
    private readonly getPedidoById: GetPedidoByIdUseCase,
    private readonly getPedidoByNumGuia: GetPedidoByNumGuiaUseCase,
    private readonly updatePedido: UpdatePedidoUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar pedidos',
    description:
      'Devuelve pedidos con tipo, estado, método, usuarios, paquete y dirección **solo como nombres** (texto). ' +
      'Opcional: `?fecha=YYYY-MM-DD` filtra por día de `creado_en` (por defecto **día en Colombia**; ver `LIST_PEDIDOS_FECHA_TZ`).',
  })
  @ApiQuery({
    name: 'fecha',
    required: false,
    example: '2026-05-10',
    description:
      'Día calendario `YYYY-MM-DD` (por defecto **Colombia**). `LIST_PEDIDOS_FECHA_TZ=UTC` usa solo UTC.',
  })
  @ApiOkResponse({ type: PedidoListadoSchema, isArray: true })
  list(@Query() query: ListPedidosQueryDto) {
  return this.listPedidos.execute({
    ...(query.fecha     && { fecha:     query.fecha }),
    ...(query.idUsuario && { idUsuario: query.idUsuario }),
  });
}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear pedido',
    description:
      'Crea un pedido con el cuerpo del formulario (destinatario, dirección, producto, manifiesto). ' +
      '**Solicitante:** `idUsuario` (`usuarios.id_usuario`) con rol **CLIENTE** o **ADMIN** vía `usuario_rol` y catálogo `rol`. ' +
      '**Tipo de operación:** `tipoOperacion` = `DESPACHO` (entrega) o `RECOLECCION` (recogida); se asigna `tipo_pedido` del catálogo por nombre. ' +
      'El backend genera **`id_pedido`**, **`num_guia`**, **`creado_en`**, asigna **`fk_estado_pedido`** al estado **creado** (`id_estado_pedido` fijo por defecto; opcional `PEDIDO_ESTADO_INICIAL_ID` en entorno), elige tipo/método y resuelve catálogos (tipo vía). **`idCiudad`**, **`idDepartamento`** y **`idPais`** alimentan `direccion` (ciudad sin FK a depto; departamento sin FK a país en BD). ' +
      'Inserta filas en `direccion`, `paquete`, `destinatario` y `pedidos`. Requiere `idUsuario` (rol CLIENTE o ADMIN), **`idCiudad`**, **`idDepartamento`**, **`idPais`** y catálogos (`tipo_via`, `tipo_pedido`, etc.). ' +
      '**Manifiesto:** `observacionesManifiesto` se devuelve en la respuesta (no hay columna en tu `pedidos`). **Fotos:** `fotosPaqueteUrls` (https) y/o `fotosPaqueteBase64` (máx. 8 en total); base64 se sube al bucket Supabase **`evidencias`** (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).',
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

  @Get('guia/:numGuia')
  @ApiOperation({
    summary: 'Buscar pedido por número de guía',
    description:
      '`num_guia` único (ej. `BL-20260509-19B426`). Si la guía contiene caracteres especiales, codifique la URL.',
  })
  @ApiParam({ name: 'numGuia', example: 'BL-20260509-19B426', description: 'Valor de `pedidos.num_guia`' })
  @ApiOkResponse({ type: PedidoListadoSchema })
  @ApiNotFoundResponse({ description: 'No existe pedido con esa guía' })
  getByGuia(@Param('numGuia') numGuia: string) {
    return this.getPedidoByNumGuia.execute(numGuia);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar pedido',
    description:
      'PATCH parcial: solo envíe campos a cambiar. Estado, método, tipo operación, montos, fecha entrega, frágil, destinatario, paquete. ' +
      'Para **cambiar dirección completa** envíe todos: `tipoViaNombre`, `nombreVia`, `numeroPlaca`, `numeroSecundario`, `idCiudad`, `idDepartamento`, `idPais`. ' +
      '`observacionesDireccion` puede ir sola. Manifiesto/fotos se sincronizan con Storage como en el alta.',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'id_pedido' })
  @ApiBody({ type: UpdatePedidoBodyDto })
  @ApiOkResponse({ type: PedidoListadoSchema })
  @ApiBadRequestResponse({ description: 'Body vacío o datos inválidos' })
  @ApiNotFoundResponse({ description: 'Pedido no encontrado' })
  patch(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdatePedidoBodyDto) {
    return this.updatePedido.execute(id, body);
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
