import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export type SupabaseJwtPayload = {
  sub: string;
  email?: string;
  role?: string;
  aud?: string | string[];
  exp?: number;
};

/**
 * Valida el access_token de Supabase Auth:
 * - **HS256** → `SUPABASE_JWT_SECRET` (Legacy JWT secret).
 * - **RS256 / ES256 / …** → JWKS en `{SUPABASE_URL}/auth/v1/.well-known/jwks.json` (proyectos con JWT signing keys nuevas).
 */
@Injectable()
export class SupabaseJwtGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseJwtGuard.name);

  constructor(private readonly config: ConfigService) {}

  private supabasePublicUrl(): string {
    const url =
      this.config.get<string>('SUPABASE_URL')?.trim() ||
      this.config.get<string>('NEXT_PUBLIC_SUPABASE_URL')?.trim();
    if (!url) {
      throw new UnauthorizedException(
        'Servidor sin SUPABASE_URL (necesaria para validar JWT firmados con JWKS).',
      );
    }
    return url.replace(/\/$/, '');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const header = req.headers.authorization;
    const token =
      typeof header === 'string' && header.startsWith('Bearer ')
        ? header.slice(7).trim()
        : null;
    if (!token) {
      this.logger.warn(`${req.method} ${req.originalUrl ?? req.url}: falta Authorization Bearer`);
      throw new UnauthorizedException('Falta encabezado Authorization: Bearer <access_token>');
    }

    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string' || !decoded.header?.alg) {
      this.logger.warn(`${req.method} ${req.originalUrl ?? req.url}: JWT mal formado`);
      throw new UnauthorizedException('JWT mal formado');
    }

    const alg = decoded.header.alg;
    let payload: SupabaseJwtPayload;

    try {
      if (alg === 'HS256') {
        const secret = this.config.get<string>('SUPABASE_JWT_SECRET')?.trim();
        if (!secret) {
          this.logger.error('JWT HS256 pero SUPABASE_JWT_SECRET no definido');
          throw new UnauthorizedException(
            'Servidor sin SUPABASE_JWT_SECRET (JWT Secret del proyecto Supabase).',
          );
        }
        payload = jwt.verify(token, secret, {
          algorithms: ['HS256'],
        }) as SupabaseJwtPayload;
      } else {
        payload = await this.verifyWithJwks(token);
      }
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      this.logger.warn(
        `${req.method} ${req.originalUrl ?? req.url}: JWT inválido (${err instanceof Error ? err.message : String(err)}) alg=${alg}`,
      );
      throw new UnauthorizedException('JWT inválido o expirado');
    }

    if (!payload?.sub) {
      this.logger.warn(`${req.method} ${req.originalUrl ?? req.url}: JWT sin claim sub`);
      throw new UnauthorizedException('Token inválido');
    }

    (req as Request & { user: SupabaseJwtPayload }).user = payload;
    return true;
  }

  private async verifyWithJwks(token: string): Promise<SupabaseJwtPayload> {
    const base = this.supabasePublicUrl();
    const issuer = `${base}/auth/v1`;
    const jwksUrl = `${issuer}/.well-known/jwks.json`;
    const JWKS = createRemoteJWKSet(new URL(jwksUrl));

    const audEnv = this.config.get<string>('SUPABASE_JWT_AUDIENCE')?.trim();
    const audience = audEnv && audEnv.length > 0 ? audEnv : 'authenticated';

    try {
      const { payload } = await jwtVerify(token, JWKS, { issuer, audience });
      return payload as unknown as SupabaseJwtPayload;
    } catch (first) {
      const msg = first instanceof Error ? first.message : String(first);
      if (/aud|Audience/i.test(msg)) {
        this.logger.warn(`JWT JWKS: falló validación de audience (${msg}); reintentando sin audience`);
        const { payload } = await jwtVerify(token, JWKS, { issuer });
        return payload as unknown as SupabaseJwtPayload;
      }
      throw first;
    }
  }
}
