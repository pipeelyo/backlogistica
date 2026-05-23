import type { FacturaListado } from '../read-models/factura-listado';

export interface ListFacturasFilter {
  idFactura?: number;
  idPedido?: number;
  idCliente?: number;
  idEstadoFactura?: number;
  /** Día de `factura.creado_en`, formato `YYYY-MM-DD`. */
  fecha?: string;
}

export interface FacturaReadPort {
  listFacturas(filter?: ListFacturasFilter): Promise<FacturaListado[]>;
  findFacturaById(idFactura: number, idCliente?: number): Promise<FacturaListado | null>;
}
