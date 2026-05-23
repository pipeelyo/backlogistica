import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { FacturaListado } from '../../domain/read-models/factura-listado';
import type { FacturaWritePort, PagarFacturaInput } from '../../domain/ports/factura-write.port';
import { facturaOrmToListado } from './factura-listado.mapper';
import { FacturaOrmEntity } from './factura.orm-entity';
import { registrarPagoFacturaAbierta } from './gestionar-factura-pedido';
import {
  cargarUsuarioClienteOAdministrador,
  usuarioEsAdministrador,
} from './usuario-rol.helpers';

@Injectable()
export class TypeOrmFacturaWriteRepository implements FacturaWritePort {
  private readonly logger = new Logger(TypeOrmFacturaWriteRepository.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async pagarFactura(input: PagarFacturaInput): Promise<FacturaListado> {
    return this.dataSource.transaction(async (manager) => {
      await cargarUsuarioClienteOAdministrador(manager, input.idUsuario);
      const esAdmin = await usuarioEsAdministrador(manager, input.idUsuario);

      const facturaCheck = await manager.getRepository(FacturaOrmEntity).findOne({
        where: { idFactura: input.idFactura },
        relations: ['cliente'],
      });
      if (!facturaCheck) {
        throw new NotFoundException(`Factura ${input.idFactura} no encontrada`);
      }
      if (!esAdmin && facturaCheck.cliente.idUsuario !== input.idUsuario) {
        throw new ForbiddenException('No puede pagar facturas de otro cliente');
      }

      try {
        const saved = await registrarPagoFacturaAbierta(manager, {
          idFactura: input.idFactura,
          idMetodoPago: input.idMetodoPago,
        });
        return facturaOrmToListado(saved);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        this.logger.warn(`pagarFactura id=${input.idFactura}: ${msg}`);
        if (/no encontrada/i.test(msg)) {
          throw new NotFoundException(msg);
        }
        throw new BadRequestException(msg);
      }
    });
  }
}
