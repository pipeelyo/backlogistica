/** Vista de lectura de `factura` para listados y detalle. */
export type FacturaListado = {
  idFactura: number;
  numero: string;
  idPedido: number;
  numGuia: string;
  idCliente: number;
  monto: number;
  montoCobrado: number;
  /** Monto aún no recaudado (`monto - montoCobrado`, mínimo 0). */
  saldoPendiente: number;
  pagadoAlCrear: boolean;
  idEstadoFactura: number;
  estadoFactura: string;
  idMetodoPago: number | null;
  metodoPago: string | null;
  fechaPago: string | null;
  fechaCierre: string | null;
  destinatarioNombre: string;
  destinatarioTelefono: string;
  direccionEntrega: string;
  creadoEn: string;
  actualizadoEn: string;
};
