import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PedidoListado } from '../../domain/read-models/pedido-listado';
import { PedidoReadPort } from '../../domain/ports/pedido-read.port';
import { DireccionOrmEntity } from './direccion.orm-entity';
import { PedidoOrmEntity } from './pedido.orm-entity';
import { UsuarioOrmEntity } from './usuario.orm-entity';

const PEDIDO_RELATIONS = [
  'tipoPedido',
  'estadoPedido',
  'metodoRecepcion',
  'usuarioSolicitud',
  'usuarioRecolector',
  'usuarioRepartidor',
  'paquete',
  'direccion',
  'direccion.tipoVia',
  'direccion.pais',
  'direccion.departamento',
  'direccion.ciudad',
] as const;

function nombreUsuario(u: UsuarioOrmEntity): string {
  return `${u.nombres} ${u.apellidos}`.trim();
}

/** Una sola línea legible para dirección (sin devolver el registro completo). */
function etiquetaDireccion(d: DireccionOrmEntity): string {
  const partes = [d.ciudad?.nombre, d.departamento?.nombre, d.zona].filter(Boolean);
  return partes.join(', ');
}

function toListado(row: PedidoOrmEntity): PedidoListado {
  return {
    idPedido: row.idPedido,
    numGuia: row.numGuia,
    creadoEn: row.creadoEn.toISOString(),
    tipoPedido: row.tipoPedido.nombre,
    estadoPedido: row.estadoPedido.nombre,
    metodoRecepcion: row.metodoRecepcion.nombre,
    usuarioSolicitud: nombreUsuario(row.usuarioSolicitud),
    usuarioRecolector: row.usuarioRecolector ? nombreUsuario(row.usuarioRecolector) : null,
    usuarioRepartidor: row.usuarioRepartidor ? nombreUsuario(row.usuarioRepartidor) : null,
    paquete: row.paquete.nombre,
    direccion: etiquetaDireccion(row.direccion),
  };
}

@Injectable()
export class TypeOrmPedidoReadRepository implements PedidoReadPort {
  constructor(
    @InjectRepository(PedidoOrmEntity)
    private readonly repo: Repository<PedidoOrmEntity>,
  ) {}

  async listPedidos(): Promise<PedidoListado[]> {
    const rows = await this.repo.find({
      relations: [...PEDIDO_RELATIONS],
      order: { creadoEn: 'DESC' },
    });
    return rows.map(toListado);
  }

  async findPedidoById(id: string): Promise<PedidoListado | null> {
    const row = await this.repo.findOne({
      where: { idPedido: id },
      relations: [...PEDIDO_RELATIONS],
    });
    return row ? toListado(row) : null;
  }
}
