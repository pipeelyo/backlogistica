import { Injectable } from '@nestjs/common';
import { Example } from '../../domain/entities/example.entity';
import { ExampleRepositoryPort } from '../../domain/ports/example.repository.port';

/**
 * Adaptador de salida (secondary): sustituible por TypeORM/Prisma/etc.
 * Implementa el puerto sin filtrar reglas de dominio hacia afuera.
 */
@Injectable()
export class InMemoryExampleRepository implements ExampleRepositoryPort {
  private readonly store = new Map<string, Example>();

  async save(entity: Example): Promise<void> {
    this.store.set(entity.id, entity);
  }

  async findById(id: string): Promise<Example | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<Example[]> {
    return [...this.store.values()];
  }
}
