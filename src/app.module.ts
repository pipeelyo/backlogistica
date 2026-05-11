import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { ExampleModule } from './modules/example/example.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { LogisticaModule } from './modules/logistica/logistica.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Rutas explícitas desde cwd (donde ejecutas `nest start` / `node dist/main.js`)
      envFilePath: [join(process.cwd(), '.env.local'), join(process.cwd(), '.env')],
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    LogisticaModule,
    ExampleModule,
  ],
})
export class AppModule {}
