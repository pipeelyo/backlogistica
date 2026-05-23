import type { FacturaListado } from '../../domain/read-models/factura-listado';
import type { FacturaOrmEntity } from './factura.orm-entity';

export function facturaOrmToListado(row: FacturaOrmEntity): FacturaListado {
  const monto = Number(row.monto);
  const montoCobrado = Number(row.montoCobrado ?? 0);
  const saldoPendiente = Math.max(0, monto - montoCobrado);

  return {
    idFactura: row.idFactura,
    numero: row.numero,
    idPedido: row.pedido.idPedido,
    numGuia: row.pedido.numGuia,
    idCliente: row.cliente.idUsuario,
    monto,
    montoCobrado,
    saldoPendiente,
    pagadoAlCrear: row.pagadoAlCrear,
    idEstadoFactura: row.estadoFactura.idEstadoFactura,
    estadoFactura: row.estadoFactura.nombre,
    idMetodoPago: row.metodoPago?.idMetodoPago ?? null,
    metodoPago: row.metodoPago?.nombre ?? null,
    fechaPago: row.fechaPago?.toISOString() ?? null,
    fechaCierre: row.fechaCierre?.toISOString() ?? null,
    destinatarioNombre: row.destinatarioNombre,
    destinatarioTelefono: row.destinatarioTelefono,
    direccionEntrega: row.direccionEntrega,
    creadoEn: row.creadoEn.toISOString(),
    actualizadoEn: row.actualizadoEn.toISOString(),
  };
}
