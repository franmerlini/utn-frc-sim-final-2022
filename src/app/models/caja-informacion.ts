import { Caja } from './caja';

export class CajaInformacion extends Caja {
  constructor(id: number, estado: string) {
    super(id, estado);
  }

  enAtencion(): void {
    this.estado === 'SA (CI)';
  }

  public override ocupar(): void {
    this.estado = 'ocupado';
  }
}
