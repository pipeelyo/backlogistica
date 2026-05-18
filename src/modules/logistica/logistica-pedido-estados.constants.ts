/** IDs tras `database/06-seed-estados-pedido.sql` (tabla vacía). */
export const ESTADO_PEDIDO_CREADO_ID = 1;
export const ESTADO_PEDIDO_ASIGNADO_ID = 2;
export const ESTADO_PEDIDO_RECIBIDO_REPARTIDOR_ID = 3;
export const ESTADO_PEDIDO_EN_CURSO_ID = 4;
export const ESTADO_PEDIDO_ENTREGADO_ID = 5;
export const ESTADO_PEDIDO_CANCELADO_ID = 6;
export const ESTADO_PEDIDO_NO_ENTREGADO_ID = 7;

/** @deprecated Usar `ESTADO_PEDIDO_CREADO_ID`; el catálogo ya no tiene «Pendiente». */
export const ESTADO_PEDIDO_PENDIENTE_ID = ESTADO_PEDIDO_CREADO_ID;

/** @deprecated Usar `ESTADO_PEDIDO_RECIBIDO_REPARTIDOR_ID` o `ESTADO_PEDIDO_EN_CURSO_ID` según flujo. */
export const ESTADO_PEDIDO_EN_CAMINO_ID = ESTADO_PEDIDO_RECIBIDO_REPARTIDOR_ID;
