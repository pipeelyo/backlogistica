import type { TransaccionReciente } from '../../domain/read-models/transaccion-reciente';
import type { FacturaOrmEntity } from './factura.orm-entity';

function nombreCliente(row: FacturaOrmEntity): string {
  return `${row.cliente.nombres} ${row.cliente.apellidos}`.trim();
}

export function facturaOrmToTransaccionReciente(row: FacturaOrmEntity): TransaccionReciente {
  return {
    numeroFactura: row.numero,
    numGuia: row.pedido.numGuia,
    cliente: nombreCliente(row),
    valor: Number(row.monto),
    moneda: 'COP',
    estadoFactura: row.estadoFactura.nombre,
    creadoEn: row.creadoEn.toISOString(),
  };
}
