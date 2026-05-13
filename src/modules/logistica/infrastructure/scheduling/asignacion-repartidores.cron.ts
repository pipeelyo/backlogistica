import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { AsignacionRepartidoresService } from '../../application/asignacion-repartidores.service';

/**
 * Asignación automática de repartidores.
 * Ahora: **cada 5 minutos** (pruebas), zona `America/Bogota`.
 * Para producción (23:30 diario), cambie el patrón del `@Cron` a `0 30 23 * * *` (misma zona).
 */
@Injectable()
export class AsignacionRepartidoresCron {
  private readonly logger = new Logger(AsignacionRepartidoresCron.name);

  constructor(
    private readonly config: ConfigService,
    private readonly asignacion: AsignacionRepartidoresService,
  ) {}

  // Pruebas: cada 5 min. (0 */5 * * * *) Producción: usar `0 30 23 * * *` (23:30 diario).
  @Cron('0 30 23 * * *', {
    timeZone: 'America/Bogota',
    name: 'asignar-repartidores-nocturno',
  })
  async ejecutarNoche(): Promise<void> {
    const enabled = this.config.get<string>('CRON_ASIGNAR_REPARTIDORES_ENABLED', 'true').toLowerCase() !== 'false';
    if (!enabled) {
      this.logger.log('Cron asignación repartidores omitido (CRON_ASIGNAR_REPARTIDORES_ENABLED=false).');
      return;
    }
    try {
      const res = await this.asignacion.ejecutar();
      this.logger.log(`Cron asignación repartidores: ${JSON.stringify(res)}`);
    } catch (e) {
      this.logger.error(
        `Cron asignación repartidores falló: ${e instanceof Error ? e.message : String(e)}`,
        e instanceof Error ? e.stack : undefined,
      );
    }
  }
}
