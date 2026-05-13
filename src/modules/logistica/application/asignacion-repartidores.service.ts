import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { getDistance } from 'geolib';
import { DataSource, In, IsNull } from 'typeorm';
import { ROL_ID_REPARTIDOR } from '../../auth/auth.constants';
import { textoDireccionColombianaMapa } from './direccion-colombiana-texto';
import { nominatimBuscarUnaDireccion } from './nominatim-geocode';
import { PedidoOrmEntity } from '../infrastructure/persistence/pedido.orm-entity';
import { UsuarioRolOrmEntity } from '../infrastructure/persistence/usuario-rol.orm-entity';

/** Por defecto: estado «pendiente» (pedidos a asignar repartidor). Override: `ASIGNACION_ESTADO_PEDIDO_PENDIENTE_ID`. */
export const ASIGNACION_DEFAULT_ESTADO_PENDIENTE_ID = 'd89468bf-71d4-4f8c-b8be-825e65adc76f';

/** Por defecto: estado «asignado» tras asignar `fk_usuario_repartidor`. Override: `ASIGNACION_ESTADO_PEDIDO_ASIGNADO_ID`. */
export const ASIGNACION_DEFAULT_ESTADO_ASIGNADO_ID = 'c5604927-4236-4672-abec-e3bbf768123d';

/** Hub de repartidor: coordenadas GPS y/o ciudad de referencia. */
export type RepartidorHubConfig = {
  idUsuario: string;
  lat?: number;
  lng?: number;
  idCiudad?: string;
};

type LatLng = { lat: number; lng: number };

function diaFechaEntrega(f: Date): string {
  const d = f instanceof Date ? f : new Date(f);
  if (Number.isNaN(d.getTime())) {
    return '1970-01-01';
  }
  return d.toISOString().slice(0, 10);
}

/** Distancia en línea recta (Haversine vía geolib), en kilómetros. */
function distanciaKm(a: LatLng, b: LatLng): number {
  return (
    getDistance(
      { latitude: a.lat, longitude: a.lng },
      { latitude: b.lat, longitude: b.lng },
    ) / 1000
  );
}

function centroid(points: LatLng[]): LatLng | null {
  if (points.length === 0) return null;
  const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  return { lat, lng };
}

function parseHubsJson(raw: string | undefined): RepartidorHubConfig[] {
  if (!raw?.trim()) return [];
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    const out: RepartidorHubConfig[] = [];
    for (const x of arr) {
      if (!x || typeof x !== 'object') continue;
      const o = x as Record<string, unknown>;
      const idUsuario = typeof o.idUsuario === 'string' ? o.idUsuario.trim() : '';
      if (!idUsuario) continue;
      const lat = typeof o.lat === 'number' ? o.lat : typeof o.latitud === 'number' ? o.latitud : undefined;
      const lng = typeof o.lng === 'number' ? o.lng : typeof o.longitud === 'number' ? o.longitud : undefined;
      const idCiudad =
        typeof o.idCiudad === 'string'
          ? o.idCiudad.trim()
          : typeof o.fkCiudad === 'string'
            ? o.fkCiudad.trim()
            : undefined;
      out.push({ idUsuario, lat, lng, idCiudad });
    }
    return out;
  } catch {
    return [];
  }
}

function parseUuidEnv(
  value: string | undefined,
  fallback: string,
  label: string,
): string {
  const v = value?.trim();
  if (!v) return fallback;
  if (!/^[0-9a-f-]{36}$/i.test(v)) {
    throw new BadRequestException(`${label} debe ser un UUID válido.`);
  }
  return v;
}

/** Orden de visita greedy (nearest neighbor) desde `inicio`; devuelve orden de índices y km acumulados en línea recta. */
function rutaNearestNeighborKm(inicio: LatLng, paradas: LatLng[]): { orden: number[]; kmTotal: number } {
  if (paradas.length === 0) {
    return { orden: [], kmTotal: 0 };
  }
  const restantes = paradas.map((p, i) => ({ p, i }));
  const orden: number[] = [];
  let cur = inicio;
  let kmTotal = 0;
  while (restantes.length > 0) {
    let bestJ = 0;
    let bestD = Number.POSITIVE_INFINITY;
    for (let j = 0; j < restantes.length; j++) {
      const d = distanciaKm(cur, restantes[j].p);
      if (d < bestD) {
        bestD = d;
        bestJ = j;
      }
    }
    const { p, i } = restantes.splice(bestJ, 1)[0];
    kmTotal += bestD;
    orden.push(i);
    cur = p;
  }
  return { orden, kmTotal };
}

/**
 * Asigna repartidor a pedidos **pendientes** y pasa a **asignado**.
 *
 * **Kilómetros / recorrido:** con `latitud`/`longitud` en `direccion` y hubs con coordenadas (o centroide por ciudad),
 * cada pedido se asigna al repartidor que minimiza la distancia **desde su última posición** (hub → 1.ª entrega → 2.ª …),
 * respetando el cupo diario. Es una heurística que encadena entregas por cercanía (no es ruta con calles ni TSP óptimo).
 * Tras cada día se registra en log un **orden NN** y km en línea recta por repartidor (informativo).
 *
 * **Dirección Colombia:** `zona` = número de vía **antes** del `#` (p. ej. `2A`); placas tras `#` en `numero_principal` / `numero_secundario`
 * (p. ej. *Calle 2A # 14B-30*). Si no hay `latitud`/`longitud` en BD, opcionalmente `ASIGNACION_GEOCODING_NOMINATIM` consulta OSM Nominatim
 * (solo en memoria en esa corrida; respeta ~1 req/s) para afinar km y orden NN. Si no, se avisa en log con `textoDireccionColombianaMapa`.
 *
 * **Estados elegibles:** por defecto solo **pendiente** (`ASIGNACION_ESTADO_PEDIDO_PENDIENTE_ID`). Si los pedidos nacen en **creado** y deben entrar al cron,
 * defina `ASIGNACION_ESTADOS_PEDIDO_ELEGIBLES` con los UUID separados por coma (p. ej. pendiente y el de `PEDIDO_ESTADO_INICIAL_ID`).
 */
@Injectable()
export class AsignacionRepartidoresService {
  private readonly logger = new Logger(AsignacionRepartidoresService.name);
  private coordsColumnsCache: boolean | null = null;

  constructor(
    private readonly config: ConfigService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  private async direccionTieneColumnasCoordenadas(): Promise<boolean> {
    if (this.coordsColumnsCache !== null) return this.coordsColumnsCache;
    const r = (await this.dataSource.query(
      `select 1 from information_schema.columns
       where table_schema = 'public' and table_name = 'direccion' and column_name = 'latitud' limit 1`,
    )) as unknown[];
    this.coordsColumnsCache = r.length > 0;
    return this.coordsColumnsCache;
  }

  private async cargarCoordenadasDirecciones(
    ids: string[],
  ): Promise<Map<string, LatLng>> {
    const map = new Map<string, LatLng>();
    if (ids.length === 0) return map;
    const tiene = await this.direccionTieneColumnasCoordenadas();
    if (!tiene) return map;
    const rows = (await this.dataSource.query(
      `select id_direccion::text as id, latitud::float8 as lat, longitud::float8 as lng
       from direccion where id_direccion = any($1::uuid[])`,
      [ids],
    )) as { id: string; lat: number | null; lng: number | null }[];
    for (const row of rows) {
      if (row.lat != null && row.lng != null && Number.isFinite(row.lat) && Number.isFinite(row.lng)) {
        map.set(row.id, { lat: row.lat, lng: row.lng });
      }
    }
    return map;
  }

  /**
   * Rellena `coordsPorDireccion` con Nominatim para direcciones sin coordenadas en BD (no persiste).
   * Requiere `ASIGNACION_NOMINATIM_CONTACT_EMAIL` (política OSM). Cache por texto de consulta deduplica la misma dirección.
   */
  private async rellenarCoordsNominatimOpcional(
    pedidos: PedidoOrmEntity[],
    coordsPorDireccion: Map<string, LatLng>,
  ): Promise<{ intentadas: number; aciertos: number }> {
    const raw = (this.config.get<string>('ASIGNACION_GEOCODING_NOMINATIM') ?? '').toLowerCase().trim();
    if (!['true', '1', 'yes'].includes(raw)) {
      return { intentadas: 0, aciertos: 0 };
    }
    const email = this.config.get<string>('ASIGNACION_NOMINATIM_CONTACT_EMAIL')?.trim();
    if (!email?.includes('@')) {
      this.logger.warn(
        'ASIGNACION_GEOCODING_NOMINATIM activo pero falta ASIGNACION_NOMINATIM_CONTACT_EMAIL válido; no se geocodifica.',
      );
      return { intentadas: 0, aciertos: 0 };
    }
    const ua = `backlogistica-asignacion/1.0 (${email})`;
    const dirPorId = new Map(pedidos.map((p) => [p.direccion.idDireccion, p.direccion]));
    const idsSinCoords = [...dirPorId.keys()].filter((id) => !coordsPorDireccion.has(id));
    const cachePorConsulta = new Map<string, LatLng | null>();
    let aciertos = 0;
    const delayMs = 1100;

    for (const id of idsSinCoords) {
      const d = dirPorId.get(id)!;
      const q = textoDireccionColombianaMapa(d);
      let ll = cachePorConsulta.get(q);
      if (ll === undefined) {
        await new Promise((r) => setTimeout(r, delayMs));
        try {
          ll = await nominatimBuscarUnaDireccion(q, ua);
        } catch (e) {
          const qLog = q.length > 100 ? `${q.slice(0, 97)}…` : q;
          this.logger.warn(`Nominatim error q="${qLog}": ${e}`);
          ll = null;
        }
        cachePorConsulta.set(q, ll);
      }
      if (ll) {
        coordsPorDireccion.set(id, ll);
        aciertos++;
      }
    }

    if (idsSinCoords.length > 0) {
      this.logger.log(
        `Nominatim (asignación): ${aciertos}/${idsSinCoords.length} dirección(es) resueltas en memoria para esta corrida (no guardadas en BD).`,
      );
    }
    return { intentadas: idsSinCoords.length, aciertos };
  }

  private idRolRepartidor(): string {
    const env = this.config.get<string>('ASIGNACION_ROL_REPARTIDOR_ID')?.trim();
    if (env && /^[0-9a-f-]{36}$/i.test(env)) {
      return env;
    }
    return ROL_ID_REPARTIDOR;
  }

  private idEstadoPendiente(): string {
    return parseUuidEnv(
      this.config.get<string>('ASIGNACION_ESTADO_PEDIDO_PENDIENTE_ID'),
      ASIGNACION_DEFAULT_ESTADO_PENDIENTE_ID,
      'ASIGNACION_ESTADO_PEDIDO_PENDIENTE_ID',
    );
  }

  private idEstadoAsignado(): string {
    return parseUuidEnv(
      this.config.get<string>('ASIGNACION_ESTADO_PEDIDO_ASIGNADO_ID'),
      ASIGNACION_DEFAULT_ESTADO_ASIGNADO_ID,
      'ASIGNACION_ESTADO_PEDIDO_ASIGNADO_ID',
    );
  }

  /**
   * Estados desde los que el cron puede asignar repartidor y pasar a **asignado**.
   * Override: `ASIGNACION_ESTADOS_PEDIDO_ELEGIBLES` = UUID separados por coma o espacio.
   */
  private idsEstadosElegiblesAsignacion(idPendiente: string): string[] {
    const raw = this.config.get<string>('ASIGNACION_ESTADOS_PEDIDO_ELEGIBLES')?.trim();
    if (!raw) return [idPendiente];
    const ids = [
      ...new Set(
        raw
          .split(/[,;\s]+/)
          .map((x) => x.trim())
          .filter((x) => /^[0-9a-f-]{36}$/i.test(x)),
      ),
    ];
    return ids.length > 0 ? ids : [idPendiente];
  }

  private maxEntregasPorRepartidorDia(): number {
    const raw = this.config.get<string>('ASIGNACION_MAX_ENTREGAS_POR_REPARTIDOR_DIA')?.trim();
    if (raw && /^\d+$/.test(raw)) {
      const n = Number(raw);
      if (n >= 1 && n <= 500) return n;
    }
    return 5;
  }

  private hubs(): RepartidorHubConfig[] {
    return parseHubsJson(this.config.get<string>('ASIGNACION_REPARTIDORES_HUBS'));
  }

  /** Fallback cuando falta GPS en dirección o hub: misma ciudad = 0, otra ciudad con hub = 25, sin datos = 1e6. */
  private distanciaProxySinGps(
    hub: RepartidorHubConfig | undefined,
    pedidoCiudadId: string,
    destCoords: LatLng | undefined,
    hubCoords: LatLng | undefined,
  ): number {
    if (destCoords && hubCoords) {
      return distanciaKm(hubCoords, destCoords);
    }
    if (hub?.idCiudad && hub.idCiudad === pedidoCiudadId) {
      return 0;
    }
    if (hub?.idCiudad) {
      return 25;
    }
    if (hub?.lat != null && hub?.lng != null && destCoords) {
      return distanciaKm({ lat: hub.lat, lng: hub.lng }, destCoords);
    }
    if (hub?.lat != null && hub?.lng != null) {
      return 5000;
    }
    return 1_000_000;
  }

  private posicionInicialRepartidor(
    repId: string,
    hubByRep: Map<string, RepartidorHubConfig>,
    coordsGlobalesDia: LatLng | null,
    coordsPorCiudadHub: Map<string, LatLng>,
  ): LatLng | null {
    const hub = hubByRep.get(repId);
    if (hub?.lat != null && hub?.lng != null && Number.isFinite(hub.lat) && Number.isFinite(hub.lng)) {
      return { lat: hub.lat, lng: hub.lng };
    }
    if (hub?.idCiudad) {
      const c = coordsPorCiudadHub.get(hub.idCiudad);
      if (c) return c;
    }
    return coordsGlobalesDia;
  }

  /**
   * Procesa un día de `fecha_entrega`: asignación greedy minimizando km desde la posición actual del repartidor.
   */
  private async procesarDiaAsignacion(params: {
    dia: string;
    lista: PedidoOrmEntity[];
    repIds: string[];
    hubByRep: Map<string, RepartidorHubConfig>;
    coordsPorDireccion: Map<string, LatLng>;
    cargaPorRepDia: Map<string, number>;
    maxPorDia: number;
    idsEstadosElegibles: string[];
    idAsignado: string;
  }): Promise<{ asignados: number; omitidosSinCupo: number }> {
    const {
      dia,
      lista,
      repIds,
      hubByRep,
      coordsPorDireccion,
      cargaPorRepDia,
      maxPorDia,
      idsEstadosElegibles,
      idAsignado,
    } = params;

    const todosPuntos = lista
      .map((p) => coordsPorDireccion.get(p.direccion.idDireccion))
      .filter((x): x is LatLng => x != null);
    const coordsGlobalesDia = centroid(todosPuntos);

    const coordsPorCiudadHub = new Map<string, LatLng>();
    for (const h of hubByRep.values()) {
      if (!h.idCiudad || coordsPorCiudadHub.has(h.idCiudad)) continue;
      const pts = lista
        .filter((p) => p.direccion.ciudad.idCiudad === h.idCiudad)
        .map((p) => coordsPorDireccion.get(p.direccion.idDireccion))
        .filter((x): x is LatLng => x != null);
      const c = centroid(pts);
      if (c) coordsPorCiudadHub.set(h.idCiudad, c);
    }

    const repPosicionActual = new Map<string, LatLng | null>();
    for (const r of repIds) {
      repPosicionActual.set(
        r,
        this.posicionInicialRepartidor(r, hubByRep, coordsGlobalesDia, coordsPorCiudadHub),
      );
    }

    const asignacionesPorRep = new Map<string, number>();
    for (const r of repIds) {
      asignacionesPorRep.set(r, 0);
    }

    const rutasBatch = new Map<string, { idPedido: string; coords: LatLng }[]>();

    const unassigned = [...lista].sort((a, b) => a.creadoEn.getTime() - b.creadoEn.getTime());
    let asignados = 0;
    let omitidosSinCupo = 0;

    while (unassigned.length > 0) {
      let bestP: PedidoOrmEntity | null = null;
      let bestR: string | null = null;
      let bestScore = Number.POSITIVE_INFINITY;
      let bestCarga = Number.POSITIVE_INFINITY;

      for (const pedido of unassigned) {
        const ciudadId = pedido.direccion.ciudad.idCiudad;
        const destCoords = coordsPorDireccion.get(pedido.direccion.idDireccion);
        for (const repId of repIds) {
          const cupoKey = `${repId}|${dia}`;
          const ya = cargaPorRepDia.get(cupoKey) ?? 0;
          if (ya >= maxPorDia) continue;

          const hub = hubByRep.get(repId);
          const hubCoords =
            hub?.lat != null && hub?.lng != null && Number.isFinite(hub.lat) && Number.isFinite(hub.lng)
              ? { lat: hub.lat, lng: hub.lng }
              : undefined;

          let dist: number;
          const pos = repPosicionActual.get(repId) ?? null;
          if (pos != null && destCoords) {
            dist = distanciaKm(pos, destCoords);
          } else {
            dist = this.distanciaProxySinGps(hub, ciudadId, destCoords, hubCoords);
          }

          const carga = asignacionesPorRep.get(repId) ?? 0;
          if (dist < bestScore || (dist === bestScore && carga < bestCarga)) {
            bestScore = dist;
            bestCarga = carga;
            bestR = repId;
            bestP = pedido;
          }
        }
      }

      if (!bestP || !bestR) {
        const n = unassigned.length;
        omitidosSinCupo += n;
        this.logger.warn(
          `Día ${dia}: ${n} pedido(s) sin asignar (cupo repartidor o sin estimación de distancia).`,
        );
        break;
      }

      const upd = (await this.dataSource.query(
        `update pedidos
         set fk_usuario_repartidor = $2::uuid,
             fk_estado_pedido = $3::uuid
         where id_pedido = $1::uuid
           and fk_estado_pedido = any($4::uuid[])
           and fk_usuario_repartidor is null
         returning id_pedido`,
        [bestP.idPedido, bestR, idAsignado, idsEstadosElegibles],
      )) as { id_pedido: string }[];

      if (upd.length === 0) {
        const idx = unassigned.findIndex((x) => x.idPedido === bestP.idPedido);
        if (idx >= 0) unassigned.splice(idx, 1);
        continue;
      }

      const dest = coordsPorDireccion.get(bestP.direccion.idDireccion);
      if (dest) {
        repPosicionActual.set(bestR, dest);
        if (!rutasBatch.has(bestR)) rutasBatch.set(bestR, []);
        rutasBatch.get(bestR)!.push({ idPedido: bestP.idPedido, coords: dest });
      }

      const idx = unassigned.findIndex((x) => x.idPedido === bestP.idPedido);
      if (idx >= 0) unassigned.splice(idx, 1);

      asignacionesPorRep.set(bestR, (asignacionesPorRep.get(bestR) ?? 0) + 1);
      const ck = `${bestR}|${dia}`;
      cargaPorRepDia.set(ck, (cargaPorRepDia.get(ck) ?? 0) + 1);
      asignados++;
    }

    for (const [repId, paradas] of rutasBatch) {
      if (paradas.length === 0) continue;
      const hub = hubByRep.get(repId);
      let inicio: LatLng | null =
        hub?.lat != null && hub?.lng != null && Number.isFinite(hub.lat) && Number.isFinite(hub.lng)
          ? { lat: hub.lat, lng: hub.lng }
          : this.posicionInicialRepartidor(repId, hubByRep, coordsGlobalesDia, coordsPorCiudadHub);
      if (!inicio && paradas.length > 0) {
        inicio = paradas[0].coords;
      }
      if (!inicio) continue;

      const coordsList = paradas.map((x) => x.coords);
      const { orden, kmTotal } = rutaNearestNeighborKm(inicio, coordsList);
      const ordenIds = orden.map((i) => paradas[i].idPedido);
      this.logger.log(
        `Ruta aprox. día=${dia} rep=${repId}: ${paradas.length} paradas, orden NN=${ordenIds.join('→')}, km línea recta ≈ ${kmTotal.toFixed(2)}`,
      );
    }

    return { asignados, omitidosSinCupo };
  }

  async ejecutar(): Promise<{
    asignados: number;
    repartidores: number;
    pedidosPendientes: number;
    omitidosSinCupo: number;
  }> {
    const idPendiente = this.idEstadoPendiente();
    const idAsignado = this.idEstadoAsignado();
    const idsEstadosElegibles = this.idsEstadosElegiblesAsignacion(idPendiente);
    const hubs = this.hubs();
    const hubByRep = new Map(hubs.map((h) => [h.idUsuario, h]));

    const idRolRep = this.idRolRepartidor();

    const urs = await this.dataSource.getRepository(UsuarioRolOrmEntity).find({
      where: { idRol: idRolRep },
    });
    const repIds = [...new Set(urs.map((u) => u.idUsuario))];
    if (repIds.length === 0) {
      this.logger.warn(`No hay usuarios con rol repartidor (id_rol=${idRolRep}).`);
      return { asignados: 0, repartidores: 0, pedidosPendientes: 0, omitidosSinCupo: 0 };
    }

    const pedidos = await this.dataSource.getRepository(PedidoOrmEntity).find({
      where: {
        usuarioRepartidor: IsNull(),
        estadoPedido: { idEstadoPedido: In(idsEstadosElegibles) },
      },
      relations: [
        'direccion',
        'direccion.tipoVia',
        'direccion.pais',
        'direccion.ciudad',
        'direccion.departamento',
      ],
      order: { creadoEn: 'ASC' },
    });

    if (pedidos.length === 0) {
      this.logger.log(
        `Asignación repartidores: 0 pedidos en estados elegibles (${idsEstadosElegibles.join(', ')}) sin repartidor.`,
      );
      return { asignados: 0, repartidores: repIds.length, pedidosPendientes: 0, omitidosSinCupo: 0 };
    }

    const maxPorDia = this.maxEntregasPorRepartidorDia();

    const rowsCupo = (await this.dataSource.query(
      `select fk_usuario_repartidor::text as rep, to_char(fecha_entrega, 'YYYY-MM-DD') as dia, count(*)::int as c
       from pedidos
       where fk_usuario_repartidor is not null
         and fk_usuario_repartidor = any($1::uuid[])
       group by fk_usuario_repartidor, fecha_entrega`,
      [repIds],
    )) as { rep: string; dia: string; c: number }[];

    const cargaPorRepDia = new Map<string, number>();
    for (const row of rowsCupo) {
      cargaPorRepDia.set(`${row.rep}|${row.dia}`, row.c);
    }

    const dirIds = [...new Set(pedidos.map((p) => p.direccion.idDireccion))];
    const coordsPorDireccion = await this.cargarCoordenadasDirecciones(dirIds);
    const geoNom = await this.rellenarCoordsNominatimOpcional(pedidos, coordsPorDireccion);

    const sinGpsIds = dirIds.filter((id) => !coordsPorDireccion.has(id));
    if (sinGpsIds.length > 0) {
      const dirPorId = new Map(pedidos.map((p) => [p.direccion.idDireccion, p.direccion]));
      const ejemplos = sinGpsIds
        .slice(0, 5)
        .map((id) => textoDireccionColombianaMapa(dirPorId.get(id)!));
      this.logger.warn(
        `Asignación: ${sinGpsIds.length} dirección(es) sin lat/long; se usa distancia por proxy (ciudad/hub). Ejemplos (tipo vía + nomenclatura + ciudad/depto/país): ${ejemplos.join(' | ')}`,
      );
    }

    const byDay = new Map<string, PedidoOrmEntity[]>();
    for (const p of pedidos) {
      const d = diaFechaEntrega(p.fechaEntrega);
      if (!byDay.has(d)) byDay.set(d, []);
      byDay.get(d)!.push(p);
    }

    let asignados = 0;
    let omitidosSinCupo = 0;
    for (const dia of [...byDay.keys()].sort()) {
      const lista = byDay.get(dia)!;
      const r = await this.procesarDiaAsignacion({
        dia,
        lista,
        repIds,
        hubByRep,
        coordsPorDireccion,
        cargaPorRepDia,
        maxPorDia,
        idsEstadosElegibles,
        idAsignado,
      });
      asignados += r.asignados;
      omitidosSinCupo += r.omitidosSinCupo;
    }

    this.logger.log(
      `Asignación repartidores: estados_origen=[${idsEstadosElegibles.join(',')}] → asignado=${idAsignado} pedidos=${pedidos.length} asignados=${asignados} omitidos_sin_cupo=${omitidosSinCupo} max_por_rep_dia=${maxPorDia} repartidores=${repIds.length} hubs_config=${hubs.length} direcciones_con_gps=${coordsPorDireccion.size} nominatim=${geoNom.aciertos}/${geoNom.intentadas} (distancia: geolib / línea recta)`,
    );

    return { asignados, repartidores: repIds.length, pedidosPendientes: pedidos.length, omitidosSinCupo };
  }
}
