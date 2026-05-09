import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CheckHealthUseCase } from '../../application/check-health.use-case';

@Controller('health')
export class HealthController {
  constructor(private readonly checkHealth: CheckHealthUseCase) {}

  /**
   * Navegadores embebidos (p. ej. Simple Browser) a veces dejan en blanco JSON puro.
   * Si el cliente no pide JSON explícito, devolvemos HTML legible; si no, el objeto (JSON).
   */
  @Get()
  getHealth(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const data = this.checkHealth.execute();
    const ua = (req.get('user-agent') ?? '').toLowerCase();
    const accept = (req.get('accept') ?? '').toLowerCase();
    const jsonPreferred =
      accept.includes('application/json') ||
      ua.includes('curl') ||
      ua.includes('wget') ||
      ua.includes('httpie') ||
      ua.includes('postman') ||
      ua.includes('insomnia');

    if (jsonPreferred) {
      return data;
    }

    res.type('html');
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Health — Backlogistica</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 2rem; color: #14532d; background: #f0fdf4; }
    code { background: #fff; padding: 0.2rem 0.45rem; border-radius: 6px; }
  </style>
</head>
<body>
  <h1>Servicio activo</h1>
  <p>Estado: <strong>${data.status}</strong></p>
  <p>Marca de tiempo: <code>${data.timestamp}</code></p>
  <p>Para JSON (API): envía la cabecera <code>Accept: application/json</code> o usa <code>curl</code>.</p>
  <p><a href="/">Volver al inicio</a></p>
</body>
</html>`;
  }
}
