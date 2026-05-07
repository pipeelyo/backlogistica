import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateExampleUseCase } from '../../application/create-example.use-case';
import { GetExampleByIdUseCase } from '../../application/get-example-by-id.use-case';
import { ListExamplesUseCase } from '../../application/list-examples.use-case';
import { CreateExampleDto } from './dto/create-example.dto';

/** Adaptador de entrada (primary): solo orquesta HTTP y delega en casos de uso. */
@Controller('examples')
export class ExampleController {
  constructor(
    private readonly createExample: CreateExampleUseCase,
    private readonly listExamples: ListExamplesUseCase,
    private readonly getExampleById: GetExampleByIdUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateExampleDto) {
    return this.createExample.execute(dto.name);
  }

  @Get()
  list() {
    return this.listExamples.execute();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.getExampleById.execute(id);
  }
}
