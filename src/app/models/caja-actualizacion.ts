import { Caja } from './caja';

export class CajaActualizacion extends Caja {
  constructor(id: number, estado: string) {
    super(id, estado);
  }

  enAtencion(): void {
    this.estado === 'SA (CA)';
  }

  public override ocupar(): void {
    this.estado = 'ocupado';
  }
}
