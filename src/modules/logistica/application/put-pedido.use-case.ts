import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { PedidoReadPort } from '../domain/ports/pedido-read.port';
import type { PedidoWritePort, PutPedidoInput } from '../domain/ports/pedido-write.port';
import { PEDIDO_READ, PEDIDO_WRITE } from '../pedidos.tokens';

@Injectable()
export class PutPedidoUseCase {
  constructor(
    @Inject(PEDIDO_READ) private readonly read: PedidoReadPort,
    @Inject(PEDIDO_WRITE) private readonly write: PedidoWritePort,
  ) {}

  /** Crea un pedido con `id` de la URL. Si ya existe, `409 Conflict`. */
  async execute(id: string, input: PutPedidoInput) {
    const existing = await this.read.findPedidoById(id);
    if (existing) {
      throw new ConflictException(`Ya existe un pedido con id ${id}`);
    }
    return this.write.insertPedido(id, input);
  }
}
