import type { PedidoListado } from '../read-models/pedido-listado';

/**
 * Payload público alineado con el formulario "Nuevo pedido" (app).
 * Los datos del cliente comercial vienen de la tabla `cliente` (`idCliente`); documento/tipo están en `usuarios`.
 */
export type CreatePedidoFormInput = {
  idCliente: string;
  nombreDestinatario: string;
  telefonoDestinatario: string;
  /** Nombre del tipo de vía (ej. Calle, Carrera) según catálogo `tipo_via`. */
  tipoViaNombre: string;
  /** Identificador de la vía (ej. 72). */
  nombreVia: string;
  /** Primer tramo del # (placa principal). */
  numeroPlaca: string;
  /** Segundo tramo del # (placa secundaria). */
  numeroSecundario: string;
  /** Nombre de ciudad exacto (trim, sin sensibilidad a mayúsculas) respecto al catálogo. */
  ciudadNombre: string;
  observacionesDireccion?: string;
  /** Texto libre para `paquete.nombre` (ej. Electrónicos). */
  tipoProductoNombre: string;
  pesoKg: number;
  valorDeclarado: number;
  fragil: boolean;
  observacionesManifiesto?: string;
  fotosPaqueteUrls?: string[];
};

export interface PedidoWritePort {
  createPedidoFromForm(input: CreatePedidoFormInput): Promise<PedidoListado>;
}
