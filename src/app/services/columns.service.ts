import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HEADER_COLUMNS, HEADER_GROUP_COLUMNS } from '../consts/consts';
import { HeaderColumn } from '../models/header-column';
import { HeaderGroupColumn } from '../models/header-group-column';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  private headerGroupColumns: HeaderGroupColumn[] = HEADER_GROUP_COLUMNS;
  private displayedHeaderGroupColumns: string[] = [];
  private tempHeaderGroupColumns: HeaderGroupColumn[] = [];
  private tempDisplayedHeaderGroupColumns: string[] = [];

  private columns: HeaderColumn[] = HEADER_COLUMNS;
  private displayedColumns: string[] = [];
  private tempColumns: HeaderColumn[] = [];
  private tempDisplayedColumns: string[] = [];

  constructor() {
    this.headerGroupColumns.map((c) => {
      this.displayedHeaderGroupColumns.push(c.columnDef);
    });

    this.columns.map((c) => {
      this.displayedColumns.push(c.columnDef);
    });
  }

  public getHeaderGroupColumns(): Observable<HeaderGroupColumn[]> {
    return of([...this.headerGroupColumns, ...this.tempHeaderGroupColumns]);
  }

  public getDisplayedHeaderGroupColumns(): Observable<string[]> {
    return of(this.tempDisplayedHeaderGroupColumns);
  }

  public addHeaderGroupColumn(column: HeaderGroupColumn): void {
    this.tempHeaderGroupColumns.push(column);
  }

  public addDisplayedHeaderGroupColumn(columnsNames: string[]): void {
    columnsNames.map((c) => {
      this.tempDisplayedHeaderGroupColumns.push(c);
    });
  }

  public getColumns(): Observable<HeaderColumn[]> {
    return of([...this.columns, ...this.tempColumns]);
  }

  public getDisplayedColumns(): Observable<string[]> {
    return of(this.tempDisplayedColumns);
  }

  public addColumn(column: HeaderColumn): void {
    this.tempColumns.push(column);
  }

  public addDisplayedColumn(columnsNames: string[]): void {
    columnsNames.map((c) => {
      this.tempDisplayedColumns.push(c);
    });
  }

  public resetColumns(): void {
    this.tempHeaderGroupColumns = [];
    this.tempDisplayedHeaderGroupColumns = [];
    this.tempColumns = [];
    this.tempDisplayedColumns = [];
  }
}
