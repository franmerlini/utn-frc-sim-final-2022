import { VECTOR_ESTADO_LENGTH } from '../consts/consts';
import { Caja } from './caja';

export class Persona {
  id: number;
  indice: number;
  estado: string;
  tiempoLlegada: number;

  constructor(id: number, estado: string, tiempoLlegada: number) {
    this.id = id;
    this.indice = VECTOR_ESTADO_LENGTH - 1 + this.id * 2;
    this.estado = estado;
    this.tiempoLlegada = tiempoLlegada;
  }

  enEsperaCajaCobro(): void {
    this.estado = 'EA (CC)';
  }

  enEsperaCajaActualizacion(): void {
    this.estado = 'EA (CA)';
  }

  enEsperaCajaInforme(): void {
    this.estado = 'EA (CI)';
  }

  enAtencionCajaCobro(caja: Caja): void {
    this.estado = `SA (CC${caja.id - 2})`;
  }

  enAtencionCajaActualizacion(): void {
    this.estado = 'SA (CA)';
  }

  enAtencionCajaInformacion(): void {
    this.estado = 'SA (CI)';
  }

  destruir(): void {
    this.estado = '';
    this.tiempoLlegada = -1;
  }
}
