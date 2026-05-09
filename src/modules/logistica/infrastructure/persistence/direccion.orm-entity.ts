import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CiudadOrmEntity } from './ciudad.orm-entity';
import { DepartamentoOrmEntity } from './departamento.orm-entity';
import { PaisOrmEntity } from './pais.orm-entity';
import { TipoViaOrmEntity } from './tipo-via.orm-entity';

@Entity({ name: 'direccion' })
export class DireccionOrmEntity {
  @PrimaryColumn({ name: 'id_direccion', type: 'uuid' })
  idDireccion!: string;

  @ManyToOne(() => TipoViaOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_tipo_via' })
  tipoVia!: TipoViaOrmEntity;

  @ManyToOne(() => PaisOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_pais' })
  pais!: PaisOrmEntity;

  @ManyToOne(() => DepartamentoOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_departamento' })
  departamento!: DepartamentoOrmEntity;

  @ManyToOne(() => CiudadOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_ciudad' })
  ciudad!: CiudadOrmEntity;

  @Column({ type: 'varchar', length: 160 })
  zona!: string;

  @Column({ name: 'numero_principal', type: 'varchar', length: 32 })
  numeroPrincipal!: string;

  @Column({ name: 'numero_secundario', type: 'varchar', length: 32 })
  numeroSecundario!: string;

  @Column({ name: 'creado_en', type: 'timestamptz' })
  creadoEn!: Date;
}
