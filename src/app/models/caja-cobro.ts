import { Caja } from './caja';

export class CajaCobro extends Caja {
  proximoFinCobro: number;

  constructor(id: number, estado: string, proximoFinCobro: number) {
    super(id, estado);
    this.proximoFinCobro = proximoFinCobro;
  }

  public override ocupar(proximoFinCobro: number): void {
    this.estado = 'ocupado';
    this.proximoFinCobro = proximoFinCobro;
  }

  enAtencion(): void {
    this.estado === `SA (CC${this.id - 2})`;
  }

  public override liberar(): void {
    this.estado = 'libre';
    this.proximoFinCobro = -1;
  }
}
