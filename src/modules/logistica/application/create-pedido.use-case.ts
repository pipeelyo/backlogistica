import { Inject, Injectable } from '@nestjs/common';
import type { CreatePedidoInput, PedidoWritePort } from '../domain/ports/pedido-write.port';
import { PEDIDO_WRITE } from '../pedidos.tokens';

@Injectable()
export class CreatePedidoUseCase {
  constructor(@Inject(PEDIDO_WRITE) private readonly write: PedidoWritePort) {}

  execute(input: CreatePedidoInput) {
    return this.write.insertPedido(input);
  }
}
