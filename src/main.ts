import './preload';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { Application } from 'express';
import { AppModule } from './app.module';
import { HttpRequestLoggingInterceptor } from './common/http-request-logging.interceptor';
import { setupSwagger } from './swagger/setup-swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new HttpRequestLoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  setupSwagger(app);

  const expressApp = app.getHttpAdapter().getInstance() as Application;
  expressApp.get('/doc', (_req, res) => {
    res.redirect(301, '/docs');
  });
  expressApp.get('/swagger', (_req, res) => {
    res.redirect(301, '/docs');
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  Logger.log(`HTTP ${port} | cwd=${process.cwd()}`, 'Bootstrap');
}

void bootstrap();
