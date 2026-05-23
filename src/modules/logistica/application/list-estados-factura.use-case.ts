import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoFacturaOrmEntity } from '../infrastructure/persistence/estado-factura.orm-entity';

@Injectable()
export class ListEstadosFacturaUseCase {
  constructor(
    @InjectRepository(EstadoFacturaOrmEntity)
    private readonly repo: Repository<EstadoFacturaOrmEntity>,
  ) {}

  execute() {
    return this.repo.find({ order: { idEstadoFactura: 'ASC' } }).then((rows) =>
      rows.map((r) => ({
        id: r.idEstadoFactura,
        nombre: r.nombre,
      })),
    );
  }
}
