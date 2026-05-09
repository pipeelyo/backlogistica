import { randomBytes, randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryFailedError } from 'typeorm';
import type { PedidoListado } from '../../domain/read-models/pedido-listado';
import type { CreatePedidoFormInput, PedidoWritePort } from '../../domain/ports/pedido-write.port';
import { pedidoOrmToListado } from './pedido-listado.mapper';
import { PEDIDO_RELATIONS } from './pedido.orm-relations';
import { CiudadOrmEntity } from './ciudad.orm-entity';
import { ClienteOrmEntity } from './cliente.orm-entity';
import { DestinatarioOrmEntity } from './destinatario.orm-entity';
import { DireccionOrmEntity } from './direccion.orm-entity';
import { EstadoPedidoOrmEntity } from './estado-pedido.orm-entity';
import { MetodoRecepcionOrmEntity } from './metodo-recepcion.orm-entity';
import { PaqueteOrmEntity } from './paquete.orm-entity';
import { PedidoOrmEntity } from './pedido.orm-entity';
import { TipoPedidoOrmEntity } from './tipo-pedido.orm-entity';
import { TipoViaOrmEntity } from './tipo-via.orm-entity';

function generarNumGuia(): string {
  const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `BL-${ymd}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

/** Línea corta para `direccion.zona` (tipo + vía + #); las observaciones largas van en `observaciones_entrega`. */
function armarZonaResumida(
  tipoViaNombre: string,
  nombreVia: string,
  placa: string,
  secundaria: string,
): string {
  let z =
    `${tipoViaNombre.trim()} ${nombreVia.trim()} # ${placa.trim()}-${secundaria.trim()}`.trim();
  if (z.length > 160) z = `${z.slice(0, 157)}...`;
  return z;
}

async function resolverTipoVia(manager: EntityManager, nombre: string): Promise<TipoViaOrmEntity> {
  const rows = await manager.getRepository(TipoViaOrmEntity).find();
  const key = nombre.trim().toLowerCase();
  const found = rows.find((r) => r.nombre.trim().toLowerCase() === key);
  if (!found) {
    throw new BadRequestException(`Tipo de vía no encontrado: "${nombre}"`);
  }
  return found;
}

async function resolverCiudad(
  manager: EntityManager,
  ciudadNombre: string,
): Promise<CiudadOrmEntity> {
  const n = ciudadNombre.trim();
  const matches = await manager
    .getRepository(CiudadOrmEntity)
    .createQueryBuilder('c')
    .leftJoinAndSelect('c.departamento', 'd')
    .leftJoinAndSelect('d.pais', 'p')
    .where('LOWER(TRIM(c.nombre)) = LOWER(TRIM(:nombre))', { nombre: n })
    .getMany();

  if (matches.length === 0) {
    throw new BadRequestException(`Ciudad no encontrada: "${n}"`);
  }
  if (matches.length > 1) {
    throw new BadRequestException(`Ciudad ambigua en catálogo: "${n}" (${matches.length} filas)`);
  }
  const c = matches[0]!;
  if (!c.departamento?.pais) {
    throw new BadRequestException(
      'La ciudad no tiene departamento/país enlazados. Ejecute y complete los FK de `database/pedidos_form_y_relaciones.sql`.',
    );
  }
  return c;
}

async function elegirTipoPedido(manager: EntityManager): Promise<TipoPedidoOrmEntity> {
  const rows = await manager.getRepository(TipoPedidoOrmEntity).find({ order: { nombre: 'ASC' } });
  if (!rows.length) throw new BadRequestException('Catálogo tipo_pedido vacío.');
  return rows.find((r) => /envío|envio|estándar|estandar|normal|dom/i.test(r.nombre)) ?? rows[0]!;
}

async function elegirMetodoRecepcion(manager: EntityManager): Promise<MetodoRecepcionOrmEntity> {
  const rows = await manager
    .getRepository(MetodoRecepcionOrmEntity)
    .find({ order: { nombre: 'ASC' } });
  if (!rows.length) throw new BadRequestException('Catálogo metodo_recepcion vacío.');
  return rows.find((r) => /domicilio|entrega|dom/i.test(r.nombre)) ?? rows[0]!;
}

async function elegirEstadoInicial(manager: EntityManager): Promise<EstadoPedidoOrmEntity> {
  const rows = await manager
    .getRepository(EstadoPedidoOrmEntity)
    .find({ order: { nombre: 'ASC' } });
  if (!rows.length) throw new BadRequestException('Catálogo estado_pedido vacío.');
  return rows.find((r) => /pendiente|creado|nuevo|ingres/i.test(r.nombre)) ?? rows[0]!;
}

@Injectable()
export class TypeOrmPedidoWriteRepository implements PedidoWritePort {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createPedidoFromForm(input: CreatePedidoFormInput): Promise<PedidoListado> {
    return this.dataSource.transaction(async (manager) => {
      const now = new Date();

      const cliente = await manager.getRepository(ClienteOrmEntity).findOne({
        where: { idCliente: input.idCliente },
        relations: ['usuario'],
      });
      if (!cliente?.usuario) {
        throw new BadRequestException(`Cliente no encontrado o sin usuario: ${input.idCliente}`);
      }
      const usuario = cliente.usuario;

      const tipoVia = await resolverTipoVia(manager, input.tipoViaNombre);
      const ciudad = await resolverCiudad(manager, input.ciudadNombre);
      const nombreViaNorm = input.nombreVia.trim().slice(0, 120);
      const zona = armarZonaResumida(
        tipoVia.nombre,
        nombreViaNorm,
        input.numeroPlaca,
        input.numeroSecundario,
      );
      const observacionesEntrega = input.observacionesDireccion?.trim() || null;

      const dirRepo = manager.getRepository(DireccionOrmEntity);
      const idDireccion = randomUUID();
      const direccion = dirRepo.create({
        idDireccion,
        tipoVia: { idTipoVia: tipoVia.idTipoVia },
        pais: { idPais: ciudad.departamento!.pais!.idPais },
        departamento: { idDepartamento: ciudad.departamento!.idDepartamento },
        ciudad: { idCiudad: ciudad.idCiudad },
        nombreVia: nombreViaNorm,
        observacionesEntrega,
        zona,
        numeroPrincipal: input.numeroPlaca.trim().slice(0, 32),
        numeroSecundario: input.numeroSecundario.trim().slice(0, 32),
        creadoEn: now,
      });
      await dirRepo.save(direccion);

      const paqRepo = manager.getRepository(PaqueteOrmEntity);
      const idPaquete = randomUUID();
      const paquete = paqRepo.create({
        idPaquete,
        nombre: input.tipoProductoNombre.trim().slice(0, 200),
        peso: input.pesoKg,
        precio: input.valorDeclarado,
        creadoEn: now,
      });
      await paqRepo.save(paquete);

      const tipoPedido = await elegirTipoPedido(manager);
      const metodo = await elegirMetodoRecepcion(manager);
      const estado = await elegirEstadoInicial(manager);
      const idPedido = randomUUID();

      const destRepo = manager.getRepository(DestinatarioOrmEntity);
      const idDestinatario = randomUUID();
      const destinatario = destRepo.create({
        idDestinatario,
        nombre: input.nombreDestinatario.trim().slice(0, 200),
        telefono: input.telefonoDestinatario.trim().slice(0, 32),
        creadoEn: now,
      });
      await destRepo.save(destinatario);

      const pedidoRepo = manager.getRepository(PedidoOrmEntity);
      const pedido = pedidoRepo.create({
        idPedido,
        numGuia: generarNumGuia(),
        creadoEn: now,
        tipoPedido: { idTipoPedido: tipoPedido.idTipoPedido },
        usuarioSolicitud: { idUsuario: usuario.idUsuario },
        cliente: { idCliente: cliente.idCliente },
        usuarioRecolector: null,
        usuarioRepartidor: null,
        metodoRecepcion: { idMetodoRecepcion: metodo.idMetodoRecepcion },
        paquete: { idPaquete },
        direccion: { idDireccion },
        estadoPedido: { idEstadoPedido: estado.idEstadoPedido },
        fragil: input.fragil,
        observacionesManifiesto: input.observacionesManifiesto?.trim() || null,
        destinatario: { idDestinatario },
        fotosPaqueteUrls: input.fotosPaqueteUrls?.length ? input.fotosPaqueteUrls : null,
      });

      try {
        await pedidoRepo.save(pedido);
      } catch (e) {
        if (e instanceof QueryFailedError) {
          const driver = e.driverError as { code?: string; message?: string } | undefined;
          if (driver?.code === '23503') {
            throw new BadRequestException(
              'No se pudo guardar el pedido: referencia inválida (revise catálogo y migraciones).',
            );
          }
          if (
            driver?.code === '42703' ||
            /column .* does not exist/i.test(String(driver?.message ?? e.message))
          ) {
            throw new BadRequestException(
              'Faltan columnas o FK en la base. Revise database/cliente.sql, database/pedidos_form_y_relaciones.sql, database/destinatario.sql y database/direccion_informacion_envio.sql.',
            );
          }
        }
        throw e;
      }

      const row = await pedidoRepo.findOne({
        where: { idPedido },
        relations: [...PEDIDO_RELATIONS],
      });
      if (!row) {
        throw new InternalServerErrorException('No se pudo leer el pedido recién creado');
      }
      return pedidoOrmToListado(row);
    });
  }
}
