import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { ListPedidosFilter, PedidoReadPort } from '../domain/ports/pedido-read.port';
import { PEDIDO_READ } from '../pedidos.tokens';

function assertFechaUtcValida(fecha: string): void {
  const d = new Date(`${fecha}T12:00:00.000Z`);
  if (Number.isNaN(d.getTime())) {
    throw new BadRequestException(`fecha inválida: ${fecha}`);
  }
  if (d.toISOString().slice(0, 10) !== fecha) {
    throw new BadRequestException(`fecha inválida: ${fecha}`);
  }
}

@Injectable()
export class ListPedidosUseCase {
  constructor(@Inject(PEDIDO_READ) private readonly pedidos: PedidoReadPort) {}

  async execute(filter?: ListPedidosFilter) {
    if (filter?.fecha) {
      assertFechaUtcValida(filter.fecha);
    }
    if (filter?.idPedido) {
      const one = await this.pedidos.findPedidoById(filter.idPedido);
      return one ? [one] : [];
    }
    return this.pedidos.listPedidos(filter);
  }
}
