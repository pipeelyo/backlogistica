import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import type { PedidoListado } from '../../domain/read-models/pedido-listado';
import type { CreatePedidoInput, PedidoWritePort } from '../../domain/ports/pedido-write.port';
import { pedidoOrmToListado } from './pedido-listado.mapper';
import { PEDIDO_RELATIONS } from './pedido.orm-relations';
import { PedidoOrmEntity } from './pedido.orm-entity';

@Injectable()
export class TypeOrmPedidoWriteRepository implements PedidoWritePort {
  constructor(
    @InjectRepository(PedidoOrmEntity)
    private readonly repo: Repository<PedidoOrmEntity>,
  ) {}

  async insertPedido(input: CreatePedidoInput): Promise<PedidoListado> {
    const id = randomUUID();
    const creadoEn = input.creadoEn ? new Date(input.creadoEn) : new Date();
    const entity = this.repo.create({
      idPedido: id,
      numGuia: input.numGuia,
      creadoEn,
      tipoPedido: { idTipoPedido: input.idTipoPedido },
      usuarioSolicitud: { idUsuario: input.idUsuarioSolicitud },
      usuarioRecolector: input.idUsuarioRecolector
        ? { idUsuario: input.idUsuarioRecolector }
        : null,
      usuarioRepartidor: input.idUsuarioRepartidor
        ? { idUsuario: input.idUsuarioRepartidor }
        : null,
      metodoRecepcion: { idMetodoRecepcion: input.idMetodoRecepcion },
      paquete: { idPaquete: input.idPaquete },
      direccion: { idDireccion: input.idDireccion },
      estadoPedido: { idEstadoPedido: input.idEstadoPedido },
    });

    try {
      await this.repo.save(entity);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        const driver = e.driverError as { code?: string } | undefined;
        if (driver?.code === '23503') {
          throw new BadRequestException(
            'Referencia inválida: compruebe que tipo, usuarios, método, paquete, dirección y estado existen.',
          );
        }
      }
      throw e;
    }

    const row = await this.repo.findOne({
      where: { idPedido: id },
      relations: [...PEDIDO_RELATIONS],
    });
    if (!row) {
      throw new InternalServerErrorException('No se pudo leer el pedido recién creado');
    }
    return pedidoOrmToListado(row);
  }
}
