import { Column, Entity, PrimaryColumn } from 'typeorm';

/** Catálogo de ciudad (sin FK a departamento: país/depto van en `direccion`). */
@Entity({ name: 'ciudad' })
export class CiudadOrmEntity {
  @PrimaryColumn({ name: 'id_ciudad', type: 'uuid' })
  idCiudad!: string;

  @Column({ type: 'varchar', length: 160 })
  nombre!: string;

  @Column({ name: 'codigo_dane', type: 'varchar', length: 16 })
  codigoDane!: string;

  @Column({ name: 'creado_en', type: 'timestamptz' })
  creadoEn!: Date;
}
