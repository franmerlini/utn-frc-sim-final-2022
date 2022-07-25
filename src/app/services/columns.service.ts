import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Column } from '../models/column';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  constructor() {}

  private displayedColumns: string[] = [
    'n',
    'evento',
    'reloj',
    'llegada',
    'proximaLlegada',
    'rndVencida',
    'vencida',
    'rndActualiza',
    'actualiza',
    'rndActualiza2',
    'actualizacion',
    'proximaActualizacion',
    'proximaInformacion',
    'rndPaga',
    'paga',
    'rndCobro',
    'cobro',
    'proximoCobro',
    'estadoCajaActualizacion',
    'estadoCajaInformacion',
    'estadoCajaCobro1',
    'proximoFinCobroCajaCobro1',
    'estadoCajaCobro2',
    'proximoFinCobroCajaCobro2',
    'estadoCajaCobro3',
    'proximoFinCobroCajaCobro3',
    'colaActualizacion',
    'colaInformacion',
    'colaCobro',
    'acumPersonasNoPagan',
    'acumTiempoPermanPersonas',
    'cantPersonas',
    'acumTiempoEsperaColaCobro',
    'cantPersonasEsperaColaCobro',
  ];
  private columns: Column[] = [];
  private tempDisplayedColumns: string[] = [];

  public addColumn(column: Column): void {
    this.columns.push(column);
  }

  public getColumns(): Observable<Column[]> {
    return of(this.columns);
  }

  public addDisplayedColumn(columnsNames: string[]): void {
    columnsNames.map((c) => {
      this.tempDisplayedColumns.push(c);
    });
  }

  public getDisplayedColumns(): Observable<string[]> {
    return of([...this.displayedColumns, ...this.tempDisplayedColumns]);
  }

  public resetColumns(): void {
    this.columns = [];
    this.tempDisplayedColumns = [];
  }
}
