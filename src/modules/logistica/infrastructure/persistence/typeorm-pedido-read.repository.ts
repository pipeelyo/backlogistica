import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  CatalogoNombreDto,
  DireccionResumenDto,
  PaqueteResumenDto,
  PedidoListado,
  UsuarioResumenDto,
} from '../../domain/read-models/pedido-listado';
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

function cat(id: string, nombre: string): CatalogoNombreDto {
  return { id, nombre };
}

function mapUsuario(u: UsuarioOrmEntity): UsuarioResumenDto {
  return {
    id: u.idUsuario,
    nombres: u.nombres,
    apellidos: u.apellidos,
    correo: u.correo,
    documento: u.documento,
    telefono: u.telefono,
  };
}

function mapDireccion(d: DireccionOrmEntity): DireccionResumenDto {
  return {
    id: d.idDireccion,
    zona: d.zona,
    numeroPrincipal: d.numeroPrincipal,
    numeroSecundario: d.numeroSecundario,
    tipoVia: cat(d.tipoVia.idTipoVia, d.tipoVia.nombre),
    pais: { id: d.pais.idPais, nombre: d.pais.nombre, codigoDane: d.pais.codigoDane },
    departamento: {
      id: d.departamento.idDepartamento,
      nombre: d.departamento.nombre,
      codigoDane: d.departamento.codigoDane,
    },
    ciudad: { id: d.ciudad.idCiudad, nombre: d.ciudad.nombre, codigoDane: d.ciudad.codigoDane },
  };
}

function mapPaquete(p: { idPaquete: string; nombre: string; peso: number; precio: number }): PaqueteResumenDto {
  return {
    id: p.idPaquete,
    nombre: p.nombre,
    peso: p.peso,
    precio: p.precio,
  };
}

function toListado(row: PedidoOrmEntity): PedidoListado {
  return {
    idPedido: row.idPedido,
    numGuia: row.numGuia,
    creadoEn: row.creadoEn.toISOString(),
    tipoPedido: cat(row.tipoPedido.idTipoPedido, row.tipoPedido.nombre),
    estadoPedido: cat(row.estadoPedido.idEstadoPedido, row.estadoPedido.nombre),
    metodoRecepcion: cat(row.metodoRecepcion.idMetodoRecepcion, row.metodoRecepcion.nombre),
    usuarioSolicitud: mapUsuario(row.usuarioSolicitud),
    usuarioRecolector: row.usuarioRecolector ? mapUsuario(row.usuarioRecolector) : null,
    usuarioRepartidor: row.usuarioRepartidor ? mapUsuario(row.usuarioRepartidor) : null,
    paquete: mapPaquete(row.paquete),
    direccion: mapDireccion(row.direccion),
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
