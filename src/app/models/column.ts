export interface Column {
  columnDef: string;
  header: string;
  cell: (fila: any) => string;
}
