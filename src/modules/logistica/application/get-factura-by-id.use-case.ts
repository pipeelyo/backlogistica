import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { FacturaReadPort } from '../domain/ports/factura-read.port';
import { FACTURA_READ } from '../facturas.tokens';
import { usuarioEsAdministrador } from '../infrastructure/persistence/usuario-rol.helpers';

@Injectable()
export class GetFacturaByIdUseCase {
  constructor(
    @Inject(FACTURA_READ) private readonly facturas: FacturaReadPort,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async execute(idFactura: number, idUsuario: number) {
    const esAdmin = await usuarioEsAdministrador(this.dataSource.manager, idUsuario);
    const idCliente = esAdmin ? undefined : idUsuario;
    const found = await this.facturas.findFacturaById(idFactura, idCliente);
    if (!found) {
      if (!esAdmin) {
        const any = await this.facturas.findFacturaById(idFactura);
        if (any && any.idCliente !== idUsuario) {
          throw new ForbiddenException('No puede consultar facturas de otro cliente');
        }
      }
      throw new NotFoundException(`Factura ${idFactura} no encontrada`);
    }
    return found;
  }
}
