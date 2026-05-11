/** Operación comercial del pedido (se mapea a una fila de `tipo_pedido` por nombre). */
export const PEDIDO_TIPO_OPERACION = ['DESPACHO', 'RECOLECCION'] as const;
export type PedidoTipoOperacion = (typeof PEDIDO_TIPO_OPERACION)[number];
