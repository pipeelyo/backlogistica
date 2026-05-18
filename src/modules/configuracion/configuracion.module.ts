import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariableOrmEntity } from './infrastructure/persistence/variable.orm-entity';
import { VariablesService } from './variables.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([VariableOrmEntity])],
  providers: [VariablesService],
  exports: [VariablesService, TypeOrmModule],
})
export class ConfiguracionModule {}
