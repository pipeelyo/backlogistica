import type { PedidoListado } from '../read-models/pedido-listado';
import type { PedidoTipoOperacion } from '../pedido-tipo-operacion';

/**
 * Payload público alineado con el formulario "Nuevo pedido" (app).
 * El solicitante es un **`usuarios.id_usuario`** con rol **Cliente** o **Administrador** en `usuario_rol` → `rol`.
 */
export type CreatePedidoFormInput = {
  idUsuario: string;
  /** `tipo_pedido.id_tipo_pedido` (ej. 1=Normal, 2=Express). */
  idTipoPedido: number;
  /** Día de entrega programado (`pedidos.fecha_entrega`, `YYYY-MM-DD`). */
  fechaEntrega: string;
  /** Despacho (entrega) vs recolección; elige `fk_metodo_recepcion` según el nombre en catálogo. */
  tipoOperacion: PedidoTipoOperacion;
  nombreDestinatario: string;
  telefonoDestinatario: string;
  /** Nombre del registro en catálogo `tipo_via` (ej. Calle, Carrera). */
  tipoViaNombre: string;
  /** Identificador de la vía (ej. 72); va en `direccion.zona`; el tipo es `fk_tipo_via`. */
  nombreVia: string;
  /** Primer tramo del # (placa principal). */
  numeroPlaca: string;
  /** Segundo tramo del # (placa secundaria). */
  numeroSecundario: string;
  /** `ciudad.id_ciudad` del catálogo (`direccion.fk_ciudad`). */
  idCiudad: number;
  /** `departamento.id_departamento` (`direccion.fk_departamento`); la tabla `ciudad` no enlaza depto en BD. */
  idDepartamento: string;
  /** `pais.id_pais` (`direccion.fk_pais`); la tabla `departamento` no enlaza país en BD. */
  idPais: string;
  observacionesDireccion?: string;
  /** Texto libre para `paquete.nombre` (ej. Electrónicos). */
  tipoProductoNombre: string;
  pesoKg: number;
  valorDeclarado: number;
  fragil: boolean;
  observacionesManifiesto?: string;
  /** URLs `https` ya públicas (opcional). */
  fotosPaqueteUrls?: string[];
  /**
   * Imágenes en base64: `data:image/png;base64,...` o JPEG en base64 crudo.
   * Se suben al bucket Supabase `evidencias` bajo `pedidos/{id_pedido}/…`; requiere variables de entorno del servidor.
   */
  fotosPaqueteBase64?: string[];
};

/** PATCH parcial: solo envíe los campos a cambiar. `null` en recolector/repartidor los desasigna. */
export type UpdatePedidoInput = {
  idEstadoPedido?: number;
  idUsuarioRecolector?: string | null;
  idUsuarioRepartidor?: string | null;
  idMetodoRecepcion?: string;
  idTipoPedido?: number;
  tipoOperacion?: PedidoTipoOperacion;
  valorDeclarado?: number;
  precio?: number;
  /** `YYYY-MM-DD` */
  fechaEntrega?: string;
  fragil?: boolean;
  nombreDestinatario?: string;
  telefonoDestinatario?: string;
  tipoViaNombre?: string;
  nombreVia?: string;
  numeroPlaca?: string;
  numeroSecundario?: string;
  idCiudad?: number;
  idDepartamento?: string;
  idPais?: string;
  observacionesDireccion?: string;
  tipoProductoNombre?: string;
  pesoKg?: number;
  observacionesManifiesto?: string;
  fotosPaqueteUrls?: string[];
  fotosPaqueteBase64?: string[];
};

export interface PedidoWritePort {
  createPedidoFromForm(input: CreatePedidoFormInput): Promise<PedidoListado>;
  /** Devuelve `null` si no existe `id_pedido`. */
  updatePedido(idPedido: string, patch: UpdatePedidoInput): Promise<PedidoListado | null>;
}
