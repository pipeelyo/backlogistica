/** IDs tras `database/16-seed-estados-factura.sql`. */
export const ESTADO_FACTURA_CREADA_ID = 1;
export const ESTADO_FACTURA_PAGADA_ID = 2;
export const ESTADO_FACTURA_POR_COBRAR_ID = 3;
export const ESTADO_FACTURA_SALDO_A_FAVOR_ID = 4;

/** Abierta: pedido aún no finalizado. */
export const ESTADOS_FACTURA_ABIERTA: readonly number[] = [ESTADO_FACTURA_CREADA_ID];
