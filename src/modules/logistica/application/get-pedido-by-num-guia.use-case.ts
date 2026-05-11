import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PedidoReadPort } from '../domain/ports/pedido-read.port';
import { PEDIDO_READ } from '../pedidos.tokens';

@Injectable()
export class GetPedidoByNumGuiaUseCase {
  constructor(@Inject(PEDIDO_READ) private readonly pedidos: PedidoReadPort) {}

  async execute(numGuia: string) {
    const found = await this.pedidos.findPedidoByNumGuia(numGuia);
    if (!found) {
      throw new NotFoundException(`Pedido con num_guia "${numGuia.trim()}" no encontrado`);
    }
    return found;
  }
}
