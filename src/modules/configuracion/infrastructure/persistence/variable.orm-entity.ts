import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'variable' })
export class VariableOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_variable' })
  idVariable!: number;

  @Column({ type: 'varchar', length: 120, unique: true })
  clave!: string;

  @Column({ type: 'text' })
  valor!: string;

  @Column({ type: 'varchar', length: 32, default: 'text' })
  tipo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ name: 'creado_en', type: 'timestamptz' })
  creadoEn!: Date;

  @UpdateDateColumn({ name: 'actualizado_en', type: 'timestamptz' })
  actualizadoEn!: Date;
}
