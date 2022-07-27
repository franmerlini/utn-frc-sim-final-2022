export interface HeaderColumn {
  columnDef: string;
  header: string;
  cell: (fila: any, columnDef: string) => string;
}
