import type { FacturaListado } from '../read-models/factura-listado';

export type PagarFacturaInput = {
  idFactura: number;
  idUsuario: number;
  idMetodoPago: number;
};

export interface FacturaWritePort {
  pagarFactura(input: PagarFacturaInput): Promise<FacturaListado>;
}
