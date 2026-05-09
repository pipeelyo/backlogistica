import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateExampleUseCase } from '../../application/create-example.use-case';
import { GetExampleByIdUseCase } from '../../application/get-example-by-id.use-case';
import { ListExamplesUseCase } from '../../application/list-examples.use-case';
import { ExampleResponseSchema } from '../../../../swagger/schemas/example.schema';
import { CreateExampleDto } from './dto/create-example.dto';

@ApiTags('Ejemplos')
@Controller('examples')
export class ExampleController {
  constructor(
    private readonly createExample: CreateExampleUseCase,
    private readonly listExamples: ListExamplesUseCase,
    private readonly getExampleById: GetExampleByIdUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear ejemplo' })
  @ApiBody({ type: CreateExampleDto })
  @ApiCreatedResponse({ type: ExampleResponseSchema })
  create(@Body() dto: CreateExampleDto) {
    return this.createExample.execute(dto.name);
  }

  @Get()
  @ApiOperation({ summary: 'Listar ejemplos' })
  @ApiOkResponse({ type: ExampleResponseSchema, isArray: true })
  list() {
    return this.listExamples.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ejemplo por id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: ExampleResponseSchema })
  @ApiNotFoundResponse()
  getOne(@Param('id') id: string) {
    return this.getExampleById.execute(id);
  }
}
