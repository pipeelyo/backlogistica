import { Inject, Injectable } from '@nestjs/common';
import type { CreatePedidoFormInput, PedidoWritePort } from '../domain/ports/pedido-write.port';
import { PEDIDO_WRITE } from '../pedidos.tokens';

@Injectable()
export class CreatePedidoUseCase {
  constructor(@Inject(PEDIDO_WRITE) private readonly write: PedidoWritePort) {}

  execute(input: CreatePedidoFormInput) {
    return this.write.createPedidoFromForm(input);
  }
}
