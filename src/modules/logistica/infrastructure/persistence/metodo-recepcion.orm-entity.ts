import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'metodo_recepcion' })
export class MetodoRecepcionOrmEntity {
  @PrimaryColumn({ name: 'id_metodo_recepcion', type: 'uuid' })
  idMetodoRecepcion!: string;

  @Column({ type: 'varchar', length: 160 })
  nombre!: string;
}
