import { Entity, PrimaryColumn } from 'typeorm';

/** N:N entre `usuarios` y `rol` (ej. rol nombre «CLIENTE»). */
@Entity({ name: 'usuario_rol' })
export class UsuarioRolOrmEntity {
  @PrimaryColumn({ name: 'id_usuario', type: 'uuid' })
  idUsuario!: string;

  @PrimaryColumn({ name: 'id_rol', type: 'int' })
  idRol!: number;
}
