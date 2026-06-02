import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { PagosRepartidorPort } from '../domain/ports/pagos-repartidor.port';
import { PAGOS_REPARTIDOR } from '../pagos-repartidor.tokens';
import type { ListRepartidoresPagoQueryDto } from '../presentation/http/dto/list-repartidores-pago.query.dto';
import { hoyYmdBogota } from './asignacion-fecha-bogota';

function assertFechaYmd(fecha: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    throw new BadRequestException('fecha debe ser YYYY-MM-DD');
  }
}

@Injectable()
export class GetPagosRepartidorKpisUseCase {
  constructor(@Inject(PAGOS_REPARTIDOR) private readonly pagos: PagosRepartidorPort) {}

  execute() {
    return this.pagos.getKpis();
  }
}

@Injectable()
export class ListRepartidoresPagoUseCase {
  constructor(@Inject(PAGOS_REPARTIDOR) private readonly pagos: PagosRepartidorPort) {}

  execute(query: ListRepartidoresPagoQueryDto) {
    if (query.fecha) assertFechaYmd(query.fecha);
    return this.pagos.listRepartidores({
      page: query.page ?? 1,
      limit: query.limit ?? 4,
      ...(query.search?.trim() && { search: query.search.trim() }),
      ...(query.estado && { estado: query.estado }),
      fecha: query.fecha ?? hoyYmdBogota(),
    });
  }
}

@Injectable()
export class GenerarDispersionRepartidorUseCase {
  constructor(@Inject(PAGOS_REPARTIDOR) private readonly pagos: PagosRepartidorPort) {}

  execute() {
    return this.pagos.generarDispersionTotal();
  }
}
