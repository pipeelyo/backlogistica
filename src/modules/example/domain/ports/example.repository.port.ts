import { Example } from '../entities/example.entity';

/** Puerto de persistencia: el dominio solo conoce esta abstracción (inversión de dependencias). */
export interface ExampleRepositoryPort {
  save(entity: Example): Promise<void>;
  findById(id: string): Promise<Example | null>;
  findAll(): Promise<Example[]>;
}
