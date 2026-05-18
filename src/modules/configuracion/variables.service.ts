import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { VariableKey } from './variable.keys';
import { VariableOrmEntity } from './infrastructure/persistence/variable.orm-entity';

const CACHE_TTL_MS = 30_000;

@Injectable()
export class VariablesService implements OnModuleInit {
  private readonly logger = new Logger(VariablesService.name);
  private cache = new Map<string, string>();
  private loadedAt = 0;

  constructor(
    @InjectRepository(VariableOrmEntity)
    private readonly repo: Repository<VariableOrmEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.refresh();
  }

  /** Recarga desde BD (p. ej. tras actualizar filas en Supabase). */
  async refresh(): Promise<void> {
    try {
      const rows = await this.repo.find({ order: { clave: 'ASC' } });
      this.cache = new Map(rows.map((r) => [r.clave, r.valor]));
      this.loadedAt = Date.now();
      this.logger.log(`Variables cargadas: ${rows.length} clave(s) desde public.variable`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.warn(`No se pudo cargar public.variable (${msg}); se usan valores por defecto del código.`);
      this.cache = new Map();
      this.loadedAt = Date.now();
    }
  }

  private async ensureFresh(): Promise<void> {
    if (Date.now() - this.loadedAt > CACHE_TTL_MS) {
      await this.refresh();
    }
  }

  async getRaw(clave: VariableKey | string): Promise<string | undefined> {
    await this.ensureFresh();
    return this.cache.get(clave);
  }

  async getBoolean(clave: VariableKey, defaultValue: boolean): Promise<boolean> {
    const raw = (await this.getRaw(clave))?.trim().toLowerCase();
    if (raw === undefined || raw === '') return defaultValue;
    if (['true', '1', 'yes', 'si', 'sí'].includes(raw)) return true;
    if (['false', '0', 'no'].includes(raw)) return false;
    return defaultValue;
  }

  async getInt(clave: VariableKey, defaultValue: number, opts?: { min?: number; max?: number }): Promise<number> {
    const raw = (await this.getRaw(clave))?.trim();
    if (!raw || !/^-?\d+$/.test(raw)) return defaultValue;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) return defaultValue;
    if (opts?.min !== undefined && n < opts.min) return defaultValue;
    if (opts?.max !== undefined && n > opts.max) return defaultValue;
    return n;
  }

  async getIntList(clave: VariableKey, defaultValue: number[]): Promise<number[]> {
    const raw = (await this.getRaw(clave))?.trim();
    if (!raw) return defaultValue;
    const ids = [
      ...new Set(
        raw
          .split(/[,;\s]+/)
          .map((x) => x.trim())
          .filter((x) => /^\d+$/.test(x))
          .map((x) => Number.parseInt(x, 10)),
      ),
    ];
    return ids.length > 0 ? ids : defaultValue;
  }

  async getText(clave: VariableKey, defaultValue: string): Promise<string> {
    const raw = await this.getRaw(clave);
    return raw !== undefined && raw !== '' ? raw : defaultValue;
  }

  async getJson<T>(clave: VariableKey, defaultValue: T): Promise<T> {
    const raw = (await this.getRaw(clave))?.trim();
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }

  async listAll(): Promise<
    { clave: string; valor: string; tipo: string; descripcion: string | null }[]
  > {
    await this.ensureFresh();
    const rows = await this.repo.find({ order: { clave: 'ASC' } });
    return rows.map((r) => ({
      clave: r.clave,
      valor: r.valor,
      tipo: r.tipo,
      descripcion: r.descripcion,
    }));
  }
}
