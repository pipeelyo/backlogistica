import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResultadoEntregaOrmEntity } from '../infrastructure/persistence/resultado-entrega.orm-entity';

@Injectable()
export class ListResultadosEntregaUseCase {
  constructor(
    @InjectRepository(ResultadoEntregaOrmEntity)
    private readonly repo: Repository<ResultadoEntregaOrmEntity>,
  ) {}

  execute() {
    return this.repo.find({ order: { nombre: 'ASC' } }).then((rows) =>
      rows.map((r) => ({
        id: r.idResultadoEntrega,
        nombre: r.nombre,
        codigo: r.codigo,
      })),
    );
  }
}
