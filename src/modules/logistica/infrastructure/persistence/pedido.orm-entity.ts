import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { ClienteOrmEntity } from './cliente.orm-entity';
import { DestinatarioOrmEntity } from './destinatario.orm-entity';
import { DireccionOrmEntity } from './direccion.orm-entity';
import { EstadoPedidoOrmEntity } from './estado-pedido.orm-entity';
import { MetodoRecepcionOrmEntity } from './metodo-recepcion.orm-entity';
import { PaqueteOrmEntity } from './paquete.orm-entity';
import { TipoPedidoOrmEntity } from './tipo-pedido.orm-entity';
import { UsuarioOrmEntity } from './usuario.orm-entity';

@Entity({ name: 'pedidos' })
export class PedidoOrmEntity {
  @PrimaryColumn({ name: 'id_pedido', type: 'uuid' })
  idPedido!: string;

  @Column({ name: 'num_guia', type: 'varchar', length: 64 })
  numGuia!: string;

  @ManyToOne(() => TipoPedidoOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_tipo_pedido' })
  tipoPedido!: TipoPedidoOrmEntity;

  @ManyToOne(() => UsuarioOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_usuario_solicitud' })
  usuarioSolicitud!: UsuarioOrmEntity;

  @ManyToOne(() => ClienteOrmEntity, { nullable: true })
  @JoinColumn({ name: 'fk_cliente' })
  cliente!: ClienteOrmEntity | null;

  @ManyToOne(() => UsuarioOrmEntity, { nullable: true })
  @JoinColumn({ name: 'fk_usuario_recolector' })
  usuarioRecolector!: UsuarioOrmEntity | null;

  @ManyToOne(() => UsuarioOrmEntity, { nullable: true })
  @JoinColumn({ name: 'fk_usuario_repartidor' })
  usuarioRepartidor!: UsuarioOrmEntity | null;

  @ManyToOne(() => MetodoRecepcionOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_metodo_recepcion' })
  metodoRecepcion!: MetodoRecepcionOrmEntity;

  @ManyToOne(() => PaqueteOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_paquete' })
  paquete!: PaqueteOrmEntity;

  @ManyToOne(() => DireccionOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_direccion' })
  direccion!: DireccionOrmEntity;

  @ManyToOne(() => EstadoPedidoOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_estado_pedido' })
  estadoPedido!: EstadoPedidoOrmEntity;

  @Column({ name: 'creado_en', type: 'timestamptz' })
  creadoEn!: Date;

  @Column({ name: 'fragil', type: 'boolean', default: false })
  fragil!: boolean;

  @Column({ name: 'observaciones_manifiesto', type: 'text', nullable: true })
  observacionesManifiesto!: string | null;

  @OneToOne(() => DestinatarioOrmEntity, { nullable: true })
  @JoinColumn({ name: 'fk_destinatario' })
  destinatario!: DestinatarioOrmEntity | null;

  @Column({ name: 'fotos_paquete_urls', type: 'jsonb', nullable: true })
  fotosPaqueteUrls!: string[] | null;
}
