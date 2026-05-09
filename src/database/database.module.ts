import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const logger = new Logger('DatabaseModule');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        if (!url?.trim()) {
          throw new Error(
            'DATABASE_URL no está definida. En Supabase: Project Settings → Database → URI (usa el pooler :6543 para la API).',
          );
        }

        try {
          const normalized = url.replace(/^postgres:\/\//i, 'postgresql://');
          const parsed = new URL(normalized);
          const host = parsed.hostname;
          const useDirect =
            config.get<string>('DATABASE_USE_DIRECT_HOST', 'false').toLowerCase() === 'true';

          if (host.startsWith('db.') && host.endsWith('.supabase.co') && !useDirect) {
            throw new Error(
              [
                'DATABASE_URL apunta al host directo de Supabase (db.*.supabase.co).',
                'En muchas redes solo hay IPv4 y ese nombre no resuelve → getaddrinfo ENOTFOUND.',
                '',
                'Solución: en el dashboard → Connect → Postgres → elige Session pooler o Transaction pooler,',
                'copia la URI (host …pooler.supabase.com, no db.…). Sustituye DATABASE_URL en tu .env.',
                '',
                'Si de verdad tienes IPv6 y quieres forzar el host directo, añade DATABASE_USE_DIRECT_HOST=true',
              ].join('\n'),
            );
          }

          if (host.startsWith('db.') && host.endsWith('.supabase.co') && useDirect) {
            logger.warn(
              'DATABASE_USE_DIRECT_HOST=true: usando host db.*.supabase.co (requiere IPv6 o red compatible).',
            );
          }
        } catch (e) {
          if (e instanceof Error && e.message.startsWith('DATABASE_URL apunta')) {
            throw e;
          }
          // URL no parseable; TypeORM seguirá con la cadena tal cual
        }

        const synchronize = config.get<string>('TYPEORM_SYNC', 'false') === 'true';

        return {
          type: 'postgres' as const,
          url,
          autoLoadEntities: true,
          synchronize,
          ssl:
            config.get<string>('DATABASE_SSL', 'true') !== 'false'
              ? { rejectUnauthorized: false }
              : false,
          // Pooler de Supabase (puerto 6543): desactiva prepared statements en el driver `pg`.
          extra:
            url.includes('pooler.supabase.com') || url.includes(':6543')
              ? { prepareThreshold: 0 }
              : undefined,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
