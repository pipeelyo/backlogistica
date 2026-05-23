import { BadRequestException } from '@nestjs/common';

export type FinanzasPeriodo = {
  fechaDesde: string;
  fechaHasta: string;
  /** Inicio inclusive (UTC) del rango en zona Colombia. */
  desdeUtc: Date;
  /** Fin exclusive (UTC) del rango en zona Colombia. */
  hastaExclusiveUtc: Date;
  dias: number;
};

function parseYmd(ymd: string, label: string): { y: number; m: number; d: number } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    throw new BadRequestException(`${label} debe ser YYYY-MM-DD`);
  }
  const d = new Date(`${ymd}T12:00:00.000Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== ymd) {
    throw new BadRequestException(`${label} inválida: ${ymd}`);
  }
  const [ys, ms, ds] = ymd.split('-');
  return { y: Number(ys), m: Number(ms), d: Number(ds) };
}

/** Día civil en Colombia → instantes UTC [inicio, fin) para consultas timestamptz. */
export function rangoDiaBogotaUtc(ymd: string): { desde: Date; hastaExclusive: Date } {
  const { y, m, d } = parseYmd(ymd, 'fecha');
  const desde = new Date(Date.UTC(y, m - 1, d, 5, 0, 0, 0));
  const hastaExclusive = new Date(Date.UTC(y, m - 1, d + 1, 5, 0, 0, 0));
  return { desde, hastaExclusive };
}

function hoyYmdBogota(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
}

function inicioMesYmdBogota(ymd: string): string {
  return `${ymd.slice(0, 7)}-01`;
}

export function resolverFinanzasPeriodo(fechaDesde?: string, fechaHasta?: string): FinanzasPeriodo {
  const hastaYmd = fechaHasta ?? hoyYmdBogota();
  const desdeYmd = fechaDesde ?? inicioMesYmdBogota(hastaYmd);
  parseYmd(desdeYmd, 'fechaDesde');
  parseYmd(hastaYmd, 'fechaHasta');
  if (desdeYmd > hastaYmd) {
    throw new BadRequestException('fechaDesde no puede ser posterior a fechaHasta');
  }

  const inicio = rangoDiaBogotaUtc(desdeYmd);
  const fin = rangoDiaBogotaUtc(hastaYmd);
  const dias =
    Math.round((fin.hastaExclusive.getTime() - inicio.desde.getTime()) / (24 * 60 * 60 * 1000)) ||
    1;

  return {
    fechaDesde: desdeYmd,
    fechaHasta: hastaYmd,
    desdeUtc: inicio.desde,
    hastaExclusiveUtc: fin.hastaExclusive,
    dias,
  };
}

/** Periodo anterior de la misma duración (para variación %). */
export function periodoAnterior(periodo: FinanzasPeriodo): FinanzasPeriodo {
  const msDia = 24 * 60 * 60 * 1000;
  const hastaExclusiveAnt = new Date(periodo.desdeUtc.getTime());
  const desdeAnt = new Date(hastaExclusiveAnt.getTime() - periodo.dias * msDia);

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });

  const fechaHastaAnt = fmt(new Date(hastaExclusiveAnt.getTime() - msDia));
  const fechaDesdeAnt = fmt(desdeAnt);

  return {
    fechaDesde: fechaDesdeAnt,
    fechaHasta: fechaHastaAnt,
    desdeUtc: desdeAnt,
    hastaExclusiveUtc: hastaExclusiveAnt,
    dias: periodo.dias,
  };
}

export function variacionPorcentaje(actual: number, anterior: number): number {
  if (anterior === 0) {
    return actual > 0 ? 100 : 0;
  }
  return Math.round(((actual - anterior) / anterior) * 100);
}

export function margenPorcentaje(utilidad: number, ingresos: number): number {
  if (ingresos <= 0) return 0;
  return Math.round((utilidad / ingresos) * 100);
}
