/** Agregado de dominio con referencias UUID (alineado a Supabase). */
export class Pedido {
  constructor(
    public readonly idPedido: string,
    public readonly numGuia: string,
    public readonly fkTipoPedido: string,
    public readonly fkUsuarioSolicitud: string,
    public readonly fkUsuarioRecolector: string | null,
    public readonly fkUsuarioRepartidor: string | null,
    public readonly fkMetodoRecepcion: string,
    public readonly fkPaquete: string,
    public readonly fkDireccion: string,
    public readonly fkEstadoPedido: string,
    public readonly creadoEn: Date,
  ) {}
}
