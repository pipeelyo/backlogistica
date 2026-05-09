export class Usuario {
  constructor(
    public readonly idUsuario: string,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly fkTipoDocumento: string,
    public readonly documento: string,
    public readonly correo: string,
    public readonly telefono: string,
    public readonly creadoEn: Date,
  ) {}
}
