import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { TipoDocumentoOrmEntity } from './tipo-documento.orm-entity';

@Entity({ name: 'usuarios' })
export class UsuarioOrmEntity {
  @PrimaryColumn({ name: 'id_usuario', type: 'uuid' })
  idUsuario!: string;

  @Column({ type: 'varchar', length: 120 })
  nombres!: string;

  @Column({ type: 'varchar', length: 120 })
  apellidos!: string;

  @ManyToOne(() => TipoDocumentoOrmEntity, { nullable: false })
  @JoinColumn({ name: 'fk_tipo_documento' })
  tipoDocumento!: TipoDocumentoOrmEntity;

  @Column({ type: 'varchar', length: 32 })
  documento!: string;

  @Column({ type: 'varchar', length: 254 })
  correo!: string;

  @Column({ type: 'varchar', length: 32 })
  telefono!: string;

  @Column({ name: 'creado_en', type: 'timestamptz' })
  creadoEn!: Date;
}
