/**
 * Vista de API: solo el nombre (o etiqueta breve) de cada tabla relacionada,
 * sin objetos completos ni ids de catálogos.
 */
export interface PedidoListado {
  idPedido: string;
  numGuia: string;
  creadoEn: string;
  tipoPedido: string;
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
