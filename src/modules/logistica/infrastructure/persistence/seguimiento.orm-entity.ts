import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EstadoPedidoOrmEntity } from './estado-pedido.orm-entity';
import { PedidoOrmEntity } from './pedido.orm-entity';

@Entity({ name: 'seguimiento' })
export class SeguimientoOrmEntity {
  @PrimaryColumn({ name: 'id_seguimiento', type: 'uuid' })
  idSeguimiento!: string;

  @ManyToOne(() => PedidoOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_pedido' })
  pedido!: PedidoOrmEntity;

  @ManyToOne(() => EstadoPedidoOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_estado' })
  estadoPedido!: EstadoPedidoOrmEntity;

  @Column({ type: 'timestamptz' })
  fecha!: Date;
}
