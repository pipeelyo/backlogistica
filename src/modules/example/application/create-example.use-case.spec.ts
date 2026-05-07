import { CreateExampleUseCase } from './create-example.use-case';
import { Example } from '../domain/entities/example.entity';
import type { ExampleRepositoryPort } from '../domain/ports/example.repository.port';

describe('CreateExampleUseCase', () => {
  it('persiste un ejemplo con nombre recortado', async () => {
    const saved: Example[] = [];
    const repo: ExampleRepositoryPort = {
      save: async (e) => {
        saved.push(e);
      },
      findById: async () => null,
      findAll: async () => [],
    };

    const useCase = new CreateExampleUseCase(repo);

    const result = await useCase.execute('  Demo  ');

    expect(result.name).toBe('Demo');
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe(result.id);
  });
});
