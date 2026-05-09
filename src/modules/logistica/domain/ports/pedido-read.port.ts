import { Pedido } from '../entities/pedido.entity';

export interface PedidoReadPort {
  listPedidos(): Promise<Pedido[]>;
  findPedidoById(id: number): Promise<Pedido | null>;
}
