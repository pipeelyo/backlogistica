import type { PedidoListado } from '../read-models/pedido-listado';

/** Filtros opcionales para listados (solo lectura). */
export interface ListPedidosFilter {
  /** Día calendario en UTC, formato `YYYY-MM-DD`. */
  fecha?: string;
  idUsuario?: string;
  /** Un solo pedido por `pedidos.id_pedido` (equivale a filtrar el listado a 0 o 1 fila). */
  idPedido?: string;
  /** `usuarios.id_usuario` del repartidor (`fk_usuario_repartidor`). */
  idRepartidor?: string;
}

export interface PedidoReadPort {
  listPedidos(filter?: ListPedidosFilter): Promise<PedidoListado[]>;
  findPedidoById(id: string): Promise<PedidoListado | null>;
  /** `num_guia` único (ej. `BL-20260509-19B426`). */
  findPedidoByNumGuia(numGuia: string): Promise<PedidoListado | null>;
}
