import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Example } from '../domain/entities/example.entity';
import type { ExampleRepositoryPort } from '../domain/ports/example.repository.port';
import { EXAMPLE_REPOSITORY } from '../example.tokens';

@Injectable()
export class CreateExampleUseCase {
  constructor(
    @Inject(EXAMPLE_REPOSITORY)
    private readonly examples: ExampleRepositoryPort,
  ) {}

  async execute(name: string): Promise<Example> {
    const trimmed = name.trim();
    const entity = new Example(randomUUID(), trimmed, new Date());
    await this.examples.save(entity);
    return entity;
  }
}
