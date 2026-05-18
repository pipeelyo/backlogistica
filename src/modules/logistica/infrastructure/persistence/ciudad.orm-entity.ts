import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Catálogo de ciudad (sin FK a departamento: país/depto van en `direccion`). */
@Entity({ name: 'ciudad' })
export class CiudadOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_ciudad' })
  idCiudad!: number;

  @Column({ type: 'varchar', length: 160 })
  nombre!: string;

  @Column({ name: 'codigo_dane', type: 'varchar', length: 16 })
  codigoDane!: string;

  @Column({ name: 'creado_en', type: 'timestamptz' })
  creadoEn!: Date;
}
