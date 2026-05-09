import type { PedidoListado } from '../read-models/pedido-listado';

export interface PedidoReadPort {
  listPedidos(): Promise<PedidoListado[]>;
  findPedidoById(id: string): Promise<PedidoListado | null>;
}
