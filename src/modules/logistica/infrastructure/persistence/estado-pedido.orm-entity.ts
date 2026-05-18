import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'estado_pedido' })
export class EstadoPedidoOrmEntity {
  @PrimaryColumn({ name: 'id_estado_pedido', type: 'int' })
  idEstadoPedido!: number;

  @Column({ type: 'varchar', length: 160 })
  nombre!: string;
}
