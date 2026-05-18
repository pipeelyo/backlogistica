/** Convierte `YYYY-MM-DD` a `Date` UTC (columna `pedidos.fecha_entrega` tipo date). */
export function parseFechaEntregaYyyyMmDd(value: string): Date {
  const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) {
    throw new Error('fechaEntrega debe ser YYYY-MM-DD');
  }
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return new Date(Date.UTC(y, mo - 1, d));
}

export function formatFechaEntregaYyyyMmDd(date: Date): string {
  const y = date.getUTCFullYear();
  const mo = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}
