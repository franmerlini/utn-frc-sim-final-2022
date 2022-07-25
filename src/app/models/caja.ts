export class Caja {
  id: number;
  estado: string;

  constructor(id: number, estado: string) {
    this.id = id;
    this.estado = estado;
  }

  public ocupar(reloj: number, proximoFinCobro: number): void {
    this.estado = 'ocupado';
  }

  public liberar(): void {
    this.estado = 'libre';
  }

  public estaLibre(): boolean {
    return this.estado === 'libre';
  }
}
