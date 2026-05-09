import type { PedidoListado } from '../../domain/read-models/pedido-listado';
import type { DireccionOrmEntity } from './direccion.orm-entity';
import type { PedidoOrmEntity } from './pedido.orm-entity';
import type { UsuarioOrmEntity } from './usuario.orm-entity';

function nombreUsuario(u: UsuarioOrmEntity): string {
  return `${u.nombres} ${u.apellidos}`.trim();
}

/** Una sola línea legible para dirección (catálogo + vía + # + observaciones resumidas). */
function etiquetaDireccion(d: DireccionOrmEntity): string {
  const nombreVia = d.nombreVia?.trim() ?? '';
  const tieneViaDetalle =
    Boolean(d.tipoVia) &&
    nombreVia !== '' &&
    Boolean(d.numeroPrincipal) &&
    Boolean(d.numeroSecundario);
  const viaLine = tieneViaDetalle
    ? `${d.tipoVia!.nombre} ${nombreVia} #${d.numeroPrincipal}-${d.numeroSecundario}`.trim()
    : d.zona;
  const obs = d.observacionesEntrega?.trim();
  const obsCorta =
    obs && obs.length > 100 ? `${obs.slice(0, 97).replace(/\s+$/, '')}…` : (obs ?? null);
  const partes = [d.ciudad?.nombre, d.departamento?.nombre, viaLine, obsCorta].filter(Boolean);
  return partes.join(', ');
}

export function pedidoOrmToListado(row: PedidoOrmEntity): PedidoListado {
  return {
    idPedido: row.idPedido,
    numGuia: row.numGuia,
    creadoEn: row.creadoEn.toISOString(),
    tipoPedido: row.tipoPedido.nombre,
    estadoPedido: row.estadoPedido.nombre,
    metodoRecepcion: row.metodoRecepcion.nombre,
    usuarioSolicitud: nombreUsuario(row.usuarioSolicitud),
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
