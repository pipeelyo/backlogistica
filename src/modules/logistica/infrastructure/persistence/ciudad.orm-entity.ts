import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DepartamentoOrmEntity } from './departamento.orm-entity';

@Entity({ name: 'ciudad' })
export class CiudadOrmEntity {
  @PrimaryColumn({ name: 'id_ciudad', type: 'uuid' })
  idCiudad!: string;

  @Column({ type: 'varchar', length: 160 })
  nombre!: string;

  @Column({ name: 'codigo_dane', type: 'varchar', length: 16 })
  codigoDane!: string;

  @ManyToOne(() => DepartamentoOrmEntity, { nullable: true })
  @JoinColumn({ name: 'fk_departamento' })
  departamento!: DepartamentoOrmEntity | null;
}
