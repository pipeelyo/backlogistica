import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import type { PedidoListado } from '../../domain/read-models/pedido-listado';
import type { ListPedidosFilter } from '../../domain/ports/pedido-read.port';
import { PedidoReadPort } from '../../domain/ports/pedido-read.port';
import { pedidoOrmToListado } from './pedido-listado.mapper';
import { PEDIDO_RELATIONS } from './pedido.orm-relations';
import { PedidoOrmEntity } from './pedido.orm-entity';

/** Inicio y fin (inclusive) del día `YYYY-MM-DD` en UTC para `Between` en `timestamptz`. */
function rangoDiaUtc(fechaYmd: string): { desde: Date; hasta: Date } {
  const desde = new Date(`${fechaYmd}T00:00:00.000Z`);
  const hasta = new Date(`${fechaYmd}T23:59:59.999Z`);
  return { desde, hasta };
}

@Injectable()
export class TypeOrmPedidoReadRepository implements PedidoReadPort {
  constructor(
    @InjectRepository(PedidoOrmEntity)
    private readonly repo: Repository<PedidoOrmEntity>,
  ) {}

  async listPedidos(filter?: ListPedidosFilter): Promise<PedidoListado[]> {
    const base = {
      relations: [...PEDIDO_RELATIONS],
      order: { creadoEn: 'DESC' as const },
    };

    if (filter?.fecha) {
      const { desde, hasta } = rangoDiaUtc(filter.fecha);
      const rows = await this.repo.find({
        ...base,
        where: { creadoEn: Between(desde, hasta) },
      });
      return rows.map(pedidoOrmToListado);
    }

    const rows = await this.repo.find(base);
    return rows.map(pedidoOrmToListado);
  }

  async findPedidoById(id: string): Promise<PedidoListado | null> {
    const row = await this.repo.findOne({
      where: { idPedido: id },
      relations: [...PEDIDO_RELATIONS],
    });
    return row ? pedidoOrmToListado(row) : null;
  }
}
