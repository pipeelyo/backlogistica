import { Inject, Injectable } from '@nestjs/common';
import type { FacturaWritePort } from '../domain/ports/factura-write.port';
import { FACTURA_WRITE } from '../facturas.tokens';
import type { PagarFacturaBodyDto } from '../presentation/http/dto/pagar-factura.body.dto';

@Injectable()
export class PagarFacturaUseCase {
  constructor(@Inject(FACTURA_WRITE) private readonly facturas: FacturaWritePort) {}

  execute(idFactura: number, idUsuario: number, body: PagarFacturaBodyDto) {
    return this.facturas.pagarFactura({
      idFactura,
      idUsuario,
      idMetodoPago: body.idMetodoPago,
    });
  }
}
