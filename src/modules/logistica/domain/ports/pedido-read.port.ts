import type { PedidoListado } from '../read-models/pedido-listado';

/** Filtros opcionales para listados (solo lectura). */
export interface ListPedidosFilter {
  /** Día calendario en UTC, formato `YYYY-MM-DD`. */
  fecha?: string;
}

export interface PedidoReadPort {
  listPedidos(filter?: ListPedidosFilter): Promise<PedidoListado[]>;
  findPedidoById(id: string): Promise<PedidoListado | null>;
  /** `num_guia` único (ej. `BL-20260509-19B426`). */
  findPedidoByNumGuia(numGuia: string): Promise<PedidoListado | null>;
}
