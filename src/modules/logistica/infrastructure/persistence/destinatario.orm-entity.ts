import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'destinatario' })
export class DestinatarioOrmEntity {
  @PrimaryColumn({ name: 'id_destinatario', type: 'uuid' })
  idDestinatario!: string;

  @Column({ type: 'varchar', length: 200 })
  nombre!: string;

  @Column({ type: 'varchar', length: 32 })
  telefono!: string;

  @Column({ name: 'creado_en', type: 'timestamptz' })
  creadoEn!: Date;
}
