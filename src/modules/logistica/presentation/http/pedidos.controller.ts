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
      'Devuelve pedidos con tipo, estado, método, usuarios, paquete y dirección en **texto legible** (nomenclatura urbana CO en `direccion`). ' +
      'Filtros opcionales en query: **`idPedido`** (un solo pedido, 0–1 resultados), **`fecha`** (día de `creado_en`, zona Colombia por defecto), **`idUsuario`** (solicitante). ' +
      'Para consultar **un pedido por id** con respuesta 404 explícita, prefiera **GET /pedidos/{id}**.',
  })
  @ApiOkResponse({ type: PedidoListadoSchema, isArray: true })
  @ApiBadRequestResponse({ description: '`fecha` inválida o UUID mal formado en query' })
  list(@Query() query: ListPedidosQueryDto) {
    return this.listPedidos.execute({
      ...(query.idPedido && { idPedido: query.idPedido }),
      ...(query.fecha && !query.idPedido && { fecha: query.fecha }),
      ...(query.idUsuario && !query.idPedido && { idUsuario: query.idUsuario }),
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear pedido',
    description:
      'Crea un pedido con el cuerpo del formulario (destinatario, dirección, producto, manifiesto). ' +
      '**Solicitante:** `idUsuario` (`usuarios.id_usuario`) con rol **Cliente** o **Administrador** vía `usuario_rol` y catálogo `rol`. ' +
      '**Modalidad:** `idTipoPedido` (Normal / Express, `GET /catalogo/tipos-pedido`). **Fecha:** `fechaEntrega` (`YYYY-MM-DD` → `pedidos.fecha_entrega`). ' +
      '**Operación:** `tipoOperacion` = `DESPACHO` o `RECOLECCION` → `metodo_recepcion` (Entrega / Recogida). ' +
      'El backend genera **`id_pedido`**, **`num_guia`**, **`creado_en`**, asigna **`fk_estado_pedido`** al estado **creado** (`PEDIDO_ESTADO_INICIAL_ID` opcional) y resuelve catálogos (tipo vía). Dirección: **`nombreVia` → `direccion.zona`** (antes del `#`), **`numeroPlaca` / `numeroSecundario`** = placas tras el `#` (p. ej. *Calle 11b # 15-40*). ' +
      'Inserta filas en `direccion`, `paquete`, `destinatario` y `pedidos`. Requiere `idUsuario` (rol Cliente o Administrador), **`idCiudad`**, **`idDepartamento`**, **`idPais`** y catálogos. ' +
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

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener pedido por id',
    description:
      'Devuelve **un** pedido por `pedidos.id_pedido` (UUID). Misma forma que el listado (`PedidoListado`): `idPedido`, `numGuia`, `estadoPedido`, `usuarioRepartidor`, `direccion` con nomenclatura CO, manifiesto y fotos desde Storage si aplica.',
  })
  @ApiParam({
    name: 'id',
    format: 'uuid',
    example: '7f6ca7e7-c7b0-48ef-94aa-805efeec41b9',
    description: 'Valor de `pedidos.id_pedido`',
  })
  @ApiOkResponse({ type: PedidoListadoSchema })
  @ApiBadRequestResponse({ description: 'El parámetro `id` no es un UUID válido' })
  @ApiNotFoundResponse({ description: 'No existe pedido con ese `id_pedido`' })
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getPedidoById.execute(id);
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
}
