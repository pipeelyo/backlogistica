import { Injectable } from '@nestjs/common';
import { VariablesService } from '../../configuracion/variables.service';

@Injectable()
export class ListVariablesUseCase {
  constructor(private readonly variables: VariablesService) {}

  execute() {
    return this.variables.listAll();
  }
}
