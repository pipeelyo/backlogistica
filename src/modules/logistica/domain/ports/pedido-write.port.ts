import type { PedidoListado } from '../read-models/pedido-listado';

/** Datos para persistir un pedido (FKs por UUID; cuerpo de `POST /pedidos`). `id_pedido` y `creado_en` los asigna el servidor. */
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
};

export interface PedidoWritePort {
  /** Inserta un pedido con `id_pedido` generado en el servidor. */
  insertPedido(input: CreatePedidoInput): Promise<PedidoListado>;
}
