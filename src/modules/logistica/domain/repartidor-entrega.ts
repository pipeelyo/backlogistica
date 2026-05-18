/** Códigos del catálogo `resultado_entrega` (ver `database/10-seed-resultado-entrega.sql`). */
export const CODIGO_RESULTADO_ENTREGA = [
  'EXITO',
  'NOVEDADES',
  'NO_ENTREGADO',
  'RECHAZADO',
] as const;
export type CodigoResultadoEntrega = (typeof CODIGO_RESULTADO_ENTREGA)[number];

/** Tras confirmar entrega, el pedido pasa a estado «Entregado». */
export function resultadoPasaAEntregado(codigo: string): boolean {
  return codigo === 'EXITO' || codigo === 'NOVEDADES';
}

/** No exige fotos de evidencia; el pedido no pasa a «Entregado». */
export function resultadoSinEntrega(codigo: string): boolean {
  return codigo === 'NO_ENTREGADO' || codigo === 'RECHAZADO';
}
