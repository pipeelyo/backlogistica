import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { ListFacturasFilter, FacturaReadPort } from '../domain/ports/factura-read.port';
import { FACTURA_READ } from '../facturas.tokens';
import { usuarioEsAdministrador } from '../infrastructure/persistence/usuario-rol.helpers';
import type { ListFacturasQueryDto } from '../presentation/http/dto/list-facturas.query.dto';

function assertFechaValida(fecha: string): void {
  const d = new Date(`${fecha}T12:00:00.000Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== fecha) {
    throw new BadRequestException(`fecha inválida: ${fecha}`);
  }
}

@Injectable()
export class ListFacturasUseCase {
  constructor(
    @Inject(FACTURA_READ) private readonly facturas: FacturaReadPort,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async execute(idUsuario: number, query: ListFacturasQueryDto) {
    if (query.fecha) {
      assertFechaValida(query.fecha);
    }

    const esAdmin = await usuarioEsAdministrador(this.dataSource.manager, idUsuario);
    const filter: ListFacturasFilter = {
      ...(query.idPedido != null && { idPedido: query.idPedido }),
      ...(query.idEstadoFactura != null && { idEstadoFactura: query.idEstadoFactura }),
      ...(query.fecha && !query.idFactura && { fecha: query.fecha }),
    };

    if (esAdmin) {
      if (query.idCliente != null) {
        filter.idCliente = query.idCliente;
      }
    } else {
      if (query.idCliente != null && query.idCliente !== idUsuario) {
        throw new ForbiddenException('Solo puede consultar sus propias facturas');
      }
      filter.idCliente = idUsuario;
    }

    if (query.idFactura != null) {
      const one = await this.facturas.findFacturaById(query.idFactura, filter.idCliente);
      return one ? [one] : [];
    }

    return this.facturas.listFacturas(filter);
  }
}
