import type { PedidoListado } from '../read-models/pedido-listado';

/** Datos para persistir un pedido (FKs por UUID; coincide con el cuerpo de `PUT /pedidos/:id`). */
export type PutPedidoInput = {
  numGuia: string;
  idTipoPedido: string;
  idUsuarioSolicitud: string;
  idUsuarioRecolector?: string | null;
  idUsuarioRepartidor?: string | null;
  idMetodoRecepcion: string;
  idPaquete: string;
  idDireccion: string;
  idEstadoPedido: string;
  /** ISO 8601; si se omite, se usa la fecha/hora actual en el servidor. */
  creadoEn?: string;
};

export interface PedidoWritePort {
  /** Inserta el pedido con `idPedido === id`. No comprueba duplicados (lo hace el caso de uso). */
  insertPedido(id: string, input: PutPedidoInput): Promise<PedidoListado>;
}
