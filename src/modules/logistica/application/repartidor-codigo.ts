/** Código legible de repartidor para UI (ej. RP-8842). */
export function codigoRepartidor(idUsuario: number): string {
  return `RP-${String(idUsuario).padStart(4, '0')}`;
}

/** Parsea búsqueda "RP-8842" / "8842" → id interno. */
export function idUsuarioDesdeBusquedaRepartidor(search: string): number | null {
  const s = search.trim();
  const m = /^(?:#?RP-?)?(\d+)$/i.exec(s);
  if (!m) return null;
  const id = Number.parseInt(m[1], 10);
  return id > 0 ? id : null;
}

export type RepartidorHubMeta = {
  vehiculo?: string;
  zona?: string;
};

/** Lee vehiculo/zona opcionales del JSON `ASIGNACION_REPARTIDORES_HUBS`. */
export function hubsRepartidorPorId(rawJson: string | undefined): Map<number, RepartidorHubMeta> {
  const map = new Map<number, RepartidorHubMeta>();
  if (!rawJson?.trim()) return map;
  try {
    const arr = JSON.parse(rawJson) as unknown;
    if (!Array.isArray(arr)) return map;
    for (const x of arr) {
      if (!x || typeof x !== 'object') continue;
      const o = x as Record<string, unknown>;
      const rawId = o.idUsuario;
      let id: number | undefined;
      if (typeof rawId === 'number' && rawId > 0) id = rawId;
      else if (typeof rawId === 'string' && /^\d+$/.test(rawId)) id = Number.parseInt(rawId, 10);
      if (id == null) continue;
      const vehiculo =
        typeof o.vehiculo === 'string' && o.vehiculo.trim() ? o.vehiculo.trim() : undefined;
      const zona = typeof o.zona === 'string' && o.zona.trim() ? o.zona.trim() : undefined;
      map.set(id, { vehiculo, zona });
    }
  } catch {
    /* ignore */
  }
  return map;
}
