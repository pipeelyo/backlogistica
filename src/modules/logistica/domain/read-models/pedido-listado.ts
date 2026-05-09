/** Vista de lectura para API: FK resueltas a tablas relacionadas (sin exponer solo UUIDs sueltos). */

export interface CatalogoNombreDto {
  id: string;
  nombre: string;
}

export interface UsuarioResumenDto {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  documento: string;
  telefono: string;
}

export interface PaqueteResumenDto {
  id: string;
  nombre: string;
  peso: number;
  precio: number;
}

export interface DireccionResumenDto {
  id: string;
  zona: string;
  numeroPrincipal: string;
  numeroSecundario: string;
  tipoVia: CatalogoNombreDto;
  pais: CatalogoNombreDto & { codigoDane: string };
  departamento: CatalogoNombreDto & { codigoDane: string };
  ciudad: CatalogoNombreDto & { codigoDane: string };
}

export interface PedidoListado {
  idPedido: string;
  numGuia: string;
  creadoEn: string;
  tipoPedido: CatalogoNombreDto;
  estadoPedido: CatalogoNombreDto;
  metodoRecepcion: CatalogoNombreDto;
  usuarioSolicitud: UsuarioResumenDto;
  usuarioRecolector: UsuarioResumenDto | null;
  usuarioRepartidor: UsuarioResumenDto | null;
  paquete: PaqueteResumenDto;
  direccion: DireccionResumenDto;
}
