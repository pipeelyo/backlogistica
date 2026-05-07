import { Module } from '@nestjs/common';
import { CreateExampleUseCase } from './application/create-example.use-case';
import { GetExampleByIdUseCase } from './application/get-example-by-id.use-case';
import { ListExamplesUseCase } from './application/list-examples.use-case';
import { EXAMPLE_REPOSITORY } from './example.tokens';
import { InMemoryExampleRepository } from './infrastructure/persistence/in-memory-example.repository';
import { ExampleController } from './presentation/http/example.controller';

@Module({
  controllers: [ExampleController],
  providers: [
    CreateExampleUseCase,
    ListExamplesUseCase,
    GetExampleByIdUseCase,
    {
      provide: EXAMPLE_REPOSITORY,
      useClass: InMemoryExampleRepository,
    },
  ],
})
export class ExampleModule {}
