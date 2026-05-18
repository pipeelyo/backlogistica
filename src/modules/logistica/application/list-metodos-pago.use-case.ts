import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPagoOrmEntity } from '../infrastructure/persistence/metodo-pago.orm-entity';

@Injectable()
export class ListMetodosPagoUseCase {
  constructor(
    @InjectRepository(MetodoPagoOrmEntity)
    private readonly repo: Repository<MetodoPagoOrmEntity>,
  ) {}

  execute() {
    return this.repo.find({ order: { nombre: 'ASC' } }).then((rows) =>
      rows.map((r) => ({
        id: r.idMetodoPago,
        nombre: r.nombre,
        codigo: r.codigo,
      })),
    );
  }
}
