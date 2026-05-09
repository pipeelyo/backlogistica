import type { PedidoListado } from '../read-models/pedido-listado';

/** Filtros opcionales para listados (solo lectura). */
export interface ListPedidosFilter {
  /** Día calendario en UTC, formato `YYYY-MM-DD`. */
  fecha?: string;
}

export interface PedidoReadPort {
  listPedidos(filter?: ListPedidosFilter): Promise<PedidoListado[]>;
  findPedidoById(id: string): Promise<PedidoListado | null>;
}
