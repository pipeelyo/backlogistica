export class Direccion {
  constructor(
    public readonly idDireccion: string,
    public readonly fkTipoVia: string,
    public readonly fkPais: string,
    public readonly fkDepartamento: string,
    public readonly fkCiudad: string,
    public readonly zona: string,
    public readonly numeroPrincipal: string,
    public readonly numeroSecundario: string,
    public readonly creadoEn: Date,
  ) {}
}
