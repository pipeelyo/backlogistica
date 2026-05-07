import { Inject, Injectable } from '@nestjs/common';
import { Example } from '../domain/entities/example.entity';
import type { ExampleRepositoryPort } from '../domain/ports/example.repository.port';
import { EXAMPLE_REPOSITORY } from '../example.tokens';

@Injectable()
export class ListExamplesUseCase {
  constructor(
    @Inject(EXAMPLE_REPOSITORY)
    private readonly examples: ExampleRepositoryPort,
  ) {}

  execute(): Promise<Example[]> {
    return this.examples.findAll();
  }
}
