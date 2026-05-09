export class Paquete {
  constructor(
    public readonly idPaquete: string,
    public readonly nombre: string,
    public readonly peso: number,
    public readonly precio: number,
    public readonly creadoEn: Date,
  ) {}
}
