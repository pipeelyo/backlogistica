import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'estado_factura' })
export class EstadoFacturaOrmEntity {
  @PrimaryColumn({ name: 'id_estado_factura', type: 'int' })
  idEstadoFactura!: number;

  @Column({ type: 'varchar', length: 80 })
  nombre!: string;
}
