import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Example } from '../domain/entities/example.entity';
import type { ExampleRepositoryPort } from '../domain/ports/example.repository.port';
import { EXAMPLE_REPOSITORY } from '../example.tokens';

@Injectable()
export class GetExampleByIdUseCase {
  constructor(
    @Inject(EXAMPLE_REPOSITORY)
    private readonly examples: ExampleRepositoryPort,
  ) {}

  async execute(id: string): Promise<Example> {
    const found = await this.examples.findById(id);
    if (!found) {
      throw new NotFoundException(`Example ${id} no encontrado`);
    }
    return found;
  }
}
