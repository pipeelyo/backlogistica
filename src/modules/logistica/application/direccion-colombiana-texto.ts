import type { DireccionOrmEntity } from '../infrastructure/persistence/direccion.orm-entity';

/**
 * Tras `#`, la placa cruzada suele ir con guión (14B-30); a veces llega con espacio (14B 30), válido en CO.
 * No altera valores que ya traen `#` o `-` en el fragmento analizado.
 */
function normalizarPlacaDespuesDeGato(fragmento: string): string {
  const t = fragmento.trim();
  if (!t || t.includes('#')) return t;
  const m = /^(\S+)\s+(\S+)$/.exec(t);
  if (m && !t.includes('-')) return `${m[1]}-${m[2]}`;
  return t;
}

/** Une `numero_principal` y `numero_secundario` como placa tras el `#`. */
function placaDespuesDeGato(principal: string, secRaw: string): string {
  const p = principal.trim();
  const s = secRaw.trim();
  if (p && s) {
    const sNorm = normalizarPlacaDespuesDeGato(s);
    return `${p}-${sNorm}`;
  }
  if (p) return normalizarPlacaDespuesDeGato(p);
  if (s) return normalizarPlacaDespuesDeGato(s);
  return '';
}

/**
 * Una sola línea de nomenclatura urbana en Colombia (sin ciudad).
 *
 * Modelo de BD esperado:
 * - **`zona`**: número (o alfanumérico) de la vía **antes** del `#` (p. ej. `2A` en *Calle 2A # 14B-30*).
 * - **`numero_principal` / `numero_secundario`**: placas **después** del `#` (p. ej. `14B` y `30`).
 * - **`tipo_via`**: Calle, Carrera, etc.
 *
 * Compatibilidad: si `zona` ya contiene `#` (datos antiguos con línea compuesta en un solo campo),
 * se usa tal cual y solo se antepone el tipo si hace falta.
 */
export function lineaNomenclaturaColombiana(d: DireccionOrmEntity): string {
  const tipo = d.tipoVia?.nombre?.trim() ?? '';
  const zona = d.zona?.trim() ?? '';
  const principal = d.numeroPrincipal?.trim() ?? '';
  const secRaw = d.numeroSecundario?.trim() ?? '';
  const placa = placaDespuesDeGato(principal, secRaw);

  if (/#/.test(zona)) {
    if (!tipo) return zona;
    if (zona.toLowerCase().startsWith(tipo.toLowerCase())) return zona;
    return `${tipo} ${zona}`;
  }

  if (tipo && zona) {
    return placa ? `${tipo} ${zona} # ${placa}` : `${tipo} ${zona}`;
  }

  return (
    [tipo, zona, placa].filter(Boolean).join(' ').trim() ||
    [tipo, principal || secRaw].filter(Boolean).join(' ').trim() ||
    tipo
  );
}

/**
 * Texto para mapas / geocodificación: línea de nomenclatura + ciudad, departamento y país.
 */
export function textoDireccionColombianaMapa(d: DireccionOrmEntity): string {
  const linea = lineaNomenclaturaColombiana(d);
  const partes = [
    linea,
    d.ciudad?.nombre?.trim(),
    d.departamento?.nombre?.trim(),
    d.pais?.nombre?.trim() || 'Colombia',
  ].filter(Boolean);

  return partes.join(', ');
}
