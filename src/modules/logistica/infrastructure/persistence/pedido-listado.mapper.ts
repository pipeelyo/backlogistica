import type { PedidoListado } from '../../domain/read-models/pedido-listado';
import type { PedidoTipoOperacion } from '../../domain/pedido-tipo-operacion';
import { lineaNomenclaturaColombiana } from '../../application/direccion-colombiana-texto';
import type { DireccionOrmEntity } from './direccion.orm-entity';
import type { PedidoOrmEntity } from './pedido.orm-entity';
import type { UsuarioOrmEntity } from './usuario.orm-entity';

function nombreUsuario(u: UsuarioOrmEntity): string {
  return `${u.nombres} ${u.apellidos}`.trim();
}

function inferirTipoOperacionDesdeNombre(nombreTipo: string): PedidoTipoOperacion | null {
  if (/recolec|recolecta|pickup|retiro|recogida/i.test(nombreTipo)) return 'RECOLECCION';
  if (/despacho|env[ií]o|entrega|domicilio|delivery/i.test(nombreTipo)) return 'DESPACHO';
  return null;
}

/** Texto del solicitante: nombre completo del usuario (`fk_usuario_solicitud`). */
function etiquetaSolicitante(row: PedidoOrmEntity): string {
  return nombreUsuario(row.usuarioSolicitud);
}

/** Ciudad, depto, línea de nomenclatura CO (`tipo` + `zona` antes de `#` + placas) y observaciones. */
function etiquetaDireccion(d: DireccionOrmEntity): string {
  const obs = d.observacionesEntrega?.trim();
  const obsCorta =
    obs && obs.length > 100 ? `${obs.slice(0, 97).replace(/\s+$/, '')}…` : (obs ?? null);
  const viaLine = lineaNomenclaturaColombiana(d);
  const partes = [d.ciudad?.nombre, d.departamento?.nombre, viaLine, obsCorta].filter(Boolean);
  return partes.join(', ');
}

export function pedidoOrmToListado(row: PedidoOrmEntity): PedidoListado {
  return {
    idPedido: row.idPedido,
    numGuia: row.numGuia,
    creadoEn: row.creadoEn.toISOString(),
    tipoPedido: row.tipoPedido.nombre,
    tipoOperacion: inferirTipoOperacionDesdeNombre(row.tipoPedido.nombre),
    estadoPedido: row.estadoPedido.nombre,
    metodoRecepcion: row.metodoRecepcion.nombre,
    usuarioSolicitud: etiquetaSolicitante(row),
    usuarioRecolector: row.usuarioRecolector ? nombreUsuario(row.usuarioRecolector) : null,
    usuarioRepartidor: row.usuarioRepartidor ? nombreUsuario(row.usuarioRepartidor) : null,
    paquete: row.paquete.nombre,
    direccion: etiquetaDireccion(row.direccion),
    destinatarioNombre: row.destinatario?.nombre ?? null,
    destinatarioTelefono: row.destinatario?.telefono ?? null,
    fragil: row.fragil ?? false,
    observacionesManifiesto: row.observacionesManifiesto ?? null,
    fotosPaqueteUrls: row.fotosPaqueteUrls ?? null,
  };
}
