import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DestinatarioOrmEntity } from './destinatario.orm-entity';
import { DireccionOrmEntity } from './direccion.orm-entity';
import { EstadoFacturaOrmEntity } from './estado-factura.orm-entity';
import { MetodoPagoOrmEntity } from './metodo-pago.orm-entity';
import { PedidoOrmEntity } from './pedido.orm-entity';
import { UsuarioOrmEntity } from './usuario.orm-entity';

@Entity({ name: 'factura' })
export class FacturaOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id_factura' })
  idFactura!: number;

  @Column({ name: 'numero', type: 'varchar', length: 32 })
  numero!: string;

  @ManyToOne(() => UsuarioOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_cliente' })
  cliente!: UsuarioOrmEntity;

  @ManyToOne(() => PedidoOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_pedido' })
  pedido!: PedidoOrmEntity;

  @ManyToOne(() => EstadoFacturaOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_estado_factura' })
  estadoFactura!: EstadoFacturaOrmEntity;

  @Column({ name: 'monto', type: 'numeric', precision: 14, scale: 4 })
  monto!: number;

  @Column({
    name: 'monto_cobrado',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0,
    comment: 'Total recaudado hasta el momento; 0 al crear si no hay prepago.',
  })
  montoCobrado!: number;

  @Column({ name: 'pagado_al_crear', type: 'boolean', default: false })
  pagadoAlCrear!: boolean;

  @Column({ name: 'fecha_pago', type: 'timestamptz', nullable: true })
  fechaPago!: Date | null;

  @Column({ name: 'fecha_cierre', type: 'timestamptz', nullable: true })
  fechaCierre!: Date | null;

  @ManyToOne(() => MetodoPagoOrmEntity, { nullable: true })
  @JoinColumn({ name: 'fk_metodo_pago' })
  metodoPago!: MetodoPagoOrmEntity | null;

  @Column({ name: 'destinatario_nombre', type: 'varchar', length: 200 })
  destinatarioNombre!: string;

  @Column({ name: 'destinatario_telefono', type: 'varchar', length: 32 })
  destinatarioTelefono!: string;

  @Column({ name: 'direccion_entrega', type: 'text' })
  direccionEntrega!: string;

  @ManyToOne(() => DestinatarioOrmEntity, { nullable: true })
  @JoinColumn({ name: 'fk_destinatario' })
  destinatario!: DestinatarioOrmEntity | null;

  @ManyToOne(() => DireccionOrmEntity, { nullable: true })
  @JoinColumn({ name: 'fk_direccion' })
  direccion!: DireccionOrmEntity | null;

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones!: string | null;

  @Column({ name: 'creado_en', type: 'timestamptz' })
  creadoEn!: Date;

  @Column({ name: 'actualizado_en', type: 'timestamptz' })
  actualizadoEn!: Date;
}
