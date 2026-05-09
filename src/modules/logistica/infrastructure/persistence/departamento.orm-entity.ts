import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PaisOrmEntity } from './pais.orm-entity';

@Entity({ name: 'departamento' })
export class DepartamentoOrmEntity {
  @PrimaryColumn({ name: 'id_departamento', type: 'uuid' })
  idDepartamento!: string;

  @Column({ type: 'varchar', length: 160 })
  nombre!: string;

  @Column({ name: 'codigo_dane', type: 'varchar', length: 16 })
  codigoDane!: string;

  @ManyToOne(() => PaisOrmEntity, { nullable: true })
  @JoinColumn({ name: 'fk_pais' })
  pais!: PaisOrmEntity | null;
}
