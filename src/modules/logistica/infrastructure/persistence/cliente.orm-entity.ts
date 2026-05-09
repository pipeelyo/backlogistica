import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UsuarioOrmEntity } from './usuario.orm-entity';

@Entity({ name: 'cliente' })
export class ClienteOrmEntity {
  @PrimaryColumn({ name: 'id_cliente', type: 'uuid' })
  idCliente!: string;

  @Column({ name: 'nombre_empresa', type: 'varchar', length: 240 })
  nombreEmpresa!: string;

  @ManyToOne(() => UsuarioOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_usuario' })
  usuario!: UsuarioOrmEntity;

  @Column({ name: 'creado_en', type: 'timestamptz' })
  creadoEn!: Date;
}
