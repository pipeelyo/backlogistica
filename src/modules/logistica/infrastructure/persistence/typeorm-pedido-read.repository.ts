import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../../domain/entities/pedido.entity';
import { PedidoReadPort } from '../../domain/ports/pedido-read.port';
import { PedidoOrmEntity } from './pedido.orm-entity';

function toDomain(row: PedidoOrmEntity): Pedido {
  return new Pedido(
    row.idPedido,
    row.numGuia,
    row.fkTipoPedido,
    row.fkUsuarioSolicitud,
    row.fkUsuarioRecolector,
    row.fkUsuarioRepartidor,
    row.fkMetodoRecepcion,
    row.fkPaquete,
    row.fkDireccion,
    row.fkEstadoPedido,
    row.creadoEn,
  );
}

@Injectable()
export class TypeOrmPedidoReadRepository implements PedidoReadPort {
  constructor(
    @InjectRepository(PedidoOrmEntity)
    private readonly repo: Repository<PedidoOrmEntity>,
  ) {}

  async listPedidos(): Promise<Pedido[]> {
    const rows = await this.repo.find({ order: { creadoEn: 'DESC' } });
    return rows.map(toDomain);
  }

  async findPedidoById(id: number): Promise<Pedido | null> {
    const row = await this.repo.findOne({ where: { idPedido: id } });
    return row ? toDomain(row) : null;
  }
}
