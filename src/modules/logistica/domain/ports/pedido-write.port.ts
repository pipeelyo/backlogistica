import type { PedidoListado } from '../read-models/pedido-listado';

/** Datos para persistir un pedido (FKs por UUID; cuerpo de `POST /pedidos`). El `id_pedido` lo asigna el servidor. */
export type CreatePedidoInput = {
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
  /** Inserta un pedido con `id_pedido` generado en el servidor. */
  insertPedido(input: CreatePedidoInput): Promise<PedidoListado>;
}
