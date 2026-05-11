import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

/**
 * Registra cada petición HTTP al terminar (éxito o error): método, ruta, código y duración.
 */
@Injectable()
export class HttpRequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const started = Date.now();
    const method = req.method;
    const path = req.originalUrl ?? req.url;

    return next.handle().pipe(
      finalize(() => {
        const ms = Date.now() - started;
        const status = res.statusCode;
        this.logger.log(`${method} ${path} ${status} ${ms}ms`);
      }),
    );
  }
}
