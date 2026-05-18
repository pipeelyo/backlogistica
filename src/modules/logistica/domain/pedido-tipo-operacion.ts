/** Despacho vs recolección; se mapea a `metodo_recepcion` por nombre (Recogida / Entrega). */
export const PEDIDO_TIPO_OPERACION = ['DESPACHO', 'RECOLECCION'] as const;
export type PedidoTipoOperacion = (typeof PEDIDO_TIPO_OPERACION)[number];
