import type { PedidoTipoOperacion } from '../pedido-tipo-operacion';

/**
 * Vista de API: solo el nombre (o etiqueta breve) de cada tabla relacionada,
 * sin objetos completos ni ids de catálogos.
 */
export interface PedidoListado {
  idPedido: string;
  numGuia: string;
  creadoEn: string;
  /** Nombre del registro en `tipo_pedido` (catálogo). */
  tipoPedido: string;
  /** Inferido desde `tipoPedido` para la app (`null` si el nombre no encaja con patrones conocidos). */
  tipoOperacion: PedidoTipoOperacion | null;
  estadoPedido: string;
  metodoRecepcion: string;
  usuarioSolicitud: string;
  usuarioRecolector: string | null;
  usuarioRepartidor: string | null;
  paquete: string;
  direccion: string;
  destinatarioNombre: string | null;
  destinatarioTelefono: string | null;
  fragil: boolean;
  observacionesManifiesto: string | null;
  fotosPaqueteUrls: string[] | null;
}
