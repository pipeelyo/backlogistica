import type { PedidoListado } from '../../domain/read-models/pedido-listado';
import type { DireccionOrmEntity } from './direccion.orm-entity';
import type { PedidoOrmEntity } from './pedido.orm-entity';
import type { UsuarioOrmEntity } from './usuario.orm-entity';

function nombreUsuario(u: UsuarioOrmEntity): string {
  return `${u.nombres} ${u.apellidos}`.trim();
}

/** Una sola línea legible para dirección (sin devolver el registro completo). */
function etiquetaDireccion(d: DireccionOrmEntity): string {
  const partes = [d.ciudad?.nombre, d.departamento?.nombre, d.zona].filter(Boolean);
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
    destinatarioNombre: row.destinatarioNombre ?? null,
    destinatarioTelefono: row.destinatarioTelefono ?? null,
    fragil: row.fragil ?? false,
    observacionesManifiesto: row.observacionesManifiesto ?? null,
    fotosPaqueteUrls: row.fotosPaqueteUrls ?? null,
  };
}
