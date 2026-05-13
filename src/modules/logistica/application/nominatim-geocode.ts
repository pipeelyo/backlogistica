/**
 * Una búsqueda en Nominatim (OSM). Política de uso: máx. ~1 req/s y User-Agent con contacto.
 * @see https://operations.osmfoundation.org/policies/nominatim/
 */
export async function nominatimBuscarUnaDireccion(
  query: string,
  userAgent: string,
  signal?: AbortSignal,
): Promise<{ lat: number; lng: number } | null> {
  const q = query.trim();
  if (!q) return null;
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', q);
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': userAgent, 'Accept-Language': 'es' },
    signal,
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { lat?: string; lon?: string }[];
  const row = data?.[0];
  if (!row?.lat || !row?.lon) return null;
  const lat = Number.parseFloat(row.lat);
  const lng = Number.parseFloat(row.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}
