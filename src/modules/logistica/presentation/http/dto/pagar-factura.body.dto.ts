import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { METODO_PAGO_TRANSFERENCIA_ID } from '../../../logistica-metodo-pago.constants';

export class PagarFacturaBodyDto {
  @ApiProperty({
    type: 'integer',
    example: METODO_PAGO_TRANSFERENCIA_ID,
    description:
      'Método de pago del prepago. Ver **GET /catalogo/metodos-pago**. ' +
      'Registra el pago total de la factura abierta (estado Creada); el cobro al entregar sigue siendo vía repartidor.',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMetodoPago!: number;
}
