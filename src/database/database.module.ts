import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';

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

        const useDirect =
          config.get<string>('DATABASE_USE_DIRECT_HOST', 'false').toLowerCase() === 'true';
        const usesPooler = url.includes('pooler.supabase.com');

        // Comprobar el host directo solo si la cadena NO es del pooler (evita falsos positivos y
        // errores de `new URL()` cuando la contraseña lleva `@` sin codificar).
        if (!usesPooler && !useDirect) {
          try {
            const normalized = url.replace(/^postgres:\/\//i, 'postgresql://');
            const parsed = new URL(normalized);
            const host = parsed.hostname;

            if (host.startsWith('db.') && host.endsWith('.supabase.co')) {
              throw new Error(
                [
                  'DATABASE_URL apunta al host directo de Supabase (db.*.supabase.co).',
                  'En muchas redes solo hay IPv4 y ese nombre no resuelve → getaddrinfo ENOTFOUND.',
                  '',
                  'Solución: en el dashboard → Connect → Postgres → Session o Transaction pooler,',
                  'copia la URI (debe contener …pooler.supabase.com). Sustituye DATABASE_URL en tu .env.',
                  '',
                  'Si la contraseña tiene @ u otros símbolos, codifícala en la URL (ej. @ → %40).',
                  'Si de verdad tienes IPv6 y quieres el host directo: DATABASE_USE_DIRECT_HOST=true',
                ].join('\n'),
              );
            }
          } catch (e) {
            if (e instanceof Error && e.message.startsWith('DATABASE_URL apunta')) {
              throw e;
            }
            // URL no parseable; TypeORM seguirá con la cadena tal cual
          }
        }

        if (useDirect && url.includes('db.') && url.includes('.supabase.co')) {
          logger.warn(
            'DATABASE_USE_DIRECT_HOST=true: usando host db.*.supabase.co (requiere IPv6 o red compatible).',
          );
        }

        const synchronize = config.get<string>('TYPEORM_SYNC', 'false') === 'true';
        const useSsl = config.get<string>('DATABASE_SSL', 'true') !== 'false';

        // No usar solo `url`: TypeORM/pg a veces no aplican bien `ssl` y falla el certificado
        // ("self-signed certificate in certificate chain"). Parseo + campos explícitos evita eso.
        const normalized = url.replace(/^postgres:\/\//i, 'postgresql://');
        const parsed = parse(normalized, { useLibpqCompat: true });

        if (!parsed.host) {
          throw new Error('DATABASE_URL no contiene un host válido tras parsearla.');
        }

        const port = parsed.port ? Number.parseInt(String(parsed.port), 10) : 5432;
        const pooled = url.includes('pooler.supabase.com') || port === 6543;

        const sslConfig: boolean | { rejectUnauthorized: boolean } = useSsl
          ? { rejectUnauthorized: false }
          : false;

        return {
          type: 'postgres' as const,
          host: parsed.host,
          port,
          username: parsed.user ?? '',
          password: parsed.password ?? '',
          database: parsed.database ?? 'postgres',
          autoLoadEntities: true,
          synchronize,
          ssl: sslConfig,
          extra: pooled ? { prepareThreshold: 0 } : undefined,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
