import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ESTADO_PEDIDO_ASIGNADO_ID,
  ESTADO_PEDIDO_EN_CAMINO_ID,
} from '../logistica-pedido-estados.constants';
import type { PedidoReadPort } from '../domain/ports/pedido-read.port';
import type { PedidoWritePort } from '../domain/ports/pedido-write.port';
import { PEDIDO_READ, PEDIDO_WRITE } from '../pedidos.tokens';
import { PedidoOrmEntity } from '../infrastructure/persistence/pedido.orm-entity';

function parseUuidEnv(value: string | undefined, fallback: string): string {
  const v = value?.trim();
  if (v && /^[0-9a-f-]{36}$/i.test(v)) return v;
  return fallback;
}

@Injectable()
export class RepartidorAceptarPedidoUseCase {
  constructor(
    private readonly config: ConfigService,
    @Inject(PEDIDO_READ) private readonly pedidos: PedidoReadPort,
    @Inject(PEDIDO_WRITE) private readonly pedidosWrite: PedidoWritePort,
    @InjectRepository(PedidoOrmEntity)
    private readonly pedidoRepo: Repository<PedidoOrmEntity>,
  ) {}

  private idEstadoAsignado(): string {
    return parseUuidEnv(
      this.config.get<string>('REPARTIDOR_PEDIDO_ESTADO_ASIGNADO_ID') ??
        this.config.get<string>('ASIGNACION_ESTADO_PEDIDO_ASIGNADO_ID') ??
        this.config.get<string>('ASIGNACION_DEFAULT_ESTADO_ASIGNADO_ID'),
      ESTADO_PEDIDO_ASIGNADO_ID,
    );
  }

  private idEstadoEnCamino(): string {
    return parseUuidEnv(
      this.config.get<string>('REPARTIDOR_PEDIDO_ESTADO_EN_CAMINO_ID'),
      ESTADO_PEDIDO_EN_CAMINO_ID,
    );
  }

  async execute(idPedido: string, idRepartidor: string) {
    const idAsignado = this.idEstadoAsignado();
    const idEnCamino = this.idEstadoEnCamino();

    const row = await this.pedidoRepo.findOne({
      where: { idPedido },
      relations: ['estadoPedido', 'usuarioRepartidor'],
    });

    if (!row) {
      throw new NotFoundException(`Pedido ${idPedido} no encontrado`);
    }

    const repId = row.usuarioRepartidor?.idUsuario ?? null;
    if (!repId || repId !== idRepartidor) {
      throw new ForbiddenException('Este pedido no está asignado a usted como repartidor.');
    }

    const estadoActual = row.estadoPedido.idEstadoPedido;
    if (estadoActual === idEnCamino) {
      throw new ConflictException('El pedido ya fue aceptado y está En Camino.');
    }
    if (estadoActual !== idAsignado) {
      throw new ConflictException(
        `Solo se puede aceptar desde estado asignado. Estado actual: ${row.estadoPedido.nombre}.`,
      );
    }

    const actualizado = await this.pedidosWrite.updatePedido(idPedido, {
      idEstadoPedido: idEnCamino,
    });
    if (!actualizado) {
      throw new NotFoundException(`Pedido ${idPedido} no encontrado tras actualizar`);
    }
    return actualizado;
  }
}
