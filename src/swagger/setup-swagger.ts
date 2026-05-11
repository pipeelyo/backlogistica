import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Backlogistica API')
    .setDescription(
      'API REST de logística (NestJS, arquitectura hexagonal). ' +
        'Los pedidos devuelven nombres de tablas relacionadas como texto. ' +
        'La documentación interactiva está en `/docs`.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Access token devuelto por **POST /auth/login** o **POST /auth/register** (JWT de Supabase Auth). ' +
          'Se acepta firma **HS256** (`SUPABASE_JWT_SECRET`) o **JWKS** (`RS256`/`ES256`, misma `SUPABASE_URL`).',
      },
      'supabase-jwt',
    )
    .addTag('Salud', 'Estado del servicio')
    .addTag('Auth', 'Registro, login y JWT (Supabase Auth)')
    .addTag('Pedidos', 'Consulta de pedidos')
    .addTag('Catálogo', 'Catálogos de apoyo (países, estados, etc.)')
    .addTag('Ejemplos', 'CRUD de ejemplo (hexagonal)')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    // Debe ser único por operación; si solo usamos methodKey, chocan p.ej. dos `list` y Swagger queda vacío.
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey.replace(/Controller$/i, '')}_${methodKey}`,
  });

  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
    customSiteTitle: 'Backlogistica API',
  });
}
