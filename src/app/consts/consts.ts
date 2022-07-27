import { HeaderColumn } from '../models/header-column';
import { HeaderGroupColumn } from '../models/header-group-column';

export const VECTOR_ESTADO_LENGTH = 33;

export const HEADER_COLUMNS: HeaderColumn[] = [
  {
    columnDef: 'n',
    header: 'N',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'evento',
    header: 'Evento',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'reloj',
    header: 'Reloj',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'llegada',
    header: 'Llegada',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'proximaLlegada',
    header: 'Próxima llegada',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'rndVencida',
    header: 'RND',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'vencida',
    header: 'Vencida?',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'rndActualiza',
    header: 'RND',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'actualiza',
    header: 'Actualiza?',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'rndActualiza2',
    header: 'RND',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'actualizacion',
    header: 'Actualización',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'proximaActualizacion',
    header: 'Próxima actualización',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'rndPaga',
    header: 'RND',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'paga',
    header: 'Paga?',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'proximaInformacion',
    header: 'Próxima información',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'rndCobro',
    header: 'RND',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'cobro',
    header: 'Cobro',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'proximoFinCobroCajaCobro1',
    header: 'Próximo cobro CC1',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'proximoFinCobroCajaCobro2',
    header: 'Próximo cobro CC2',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'proximoFinCobroCajaCobro3',
    header: 'Próximo cobro CC3',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'estadoCajaActualizacion',
    header: 'Estado CA',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'estadoCajaInformacion',
    header: 'Estado CI',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'estadoCajaCobro1',
    header: 'Estado CC1',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'estadoCajaCobro2',
    header: 'Estado CC2',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'estadoCajaCobro3',
    header: 'Estado CC3',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'colaActualizacion',
    header: 'Actualización',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'colaInformacion',
    header: 'Información',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'colaCobro',
    header: 'Cobro',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'acumPersonasNoPagan',
    header: 'Acum. personas no pagan',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'acumTiempoPermanPersonas',
    header: 'Acum. tiempo permanencia personas',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'cantPersonas',
    header: 'Acum. personas',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'acumTiempoEsperaColaCobro',
    header: 'Acum. tiempo espera cola cobro',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
  {
    columnDef: 'cantPersonasEsperaColaCobro',
    header: 'Acum. personas espera cola cobro',
    cell: (fila: any, columnDef: string) => {
      return fila[columnDef];
    },
  },
];

export const HEADER_GROUP_COLUMNS: HeaderGroupColumn[] = [
  {
    columnDef: 'n-evento-reloj',
    header: '',
    colspan: 3,
  },
  {
    columnDef: 'llegadaPersona',
    header: 'Llegada persona',
    colspan: 6,
  },
  {
    columnDef: 'finActualizacion',
    header: 'Fin actualización',
    colspan: 5,
  },
  {
    columnDef: 'finInformacion',
    header: 'Fin información',
    colspan: 1,
  },
  {
    columnDef: 'finCobro',
    header: 'Fin cobro',
    colspan: 5,
  },
  {
    columnDef: 'cajas',
    header: 'Cajas',
    colspan: 5,
  },
  {
    columnDef: 'colas',
    header: 'Colas',
    colspan: 3,
  },
  {
    columnDef: 'variablesEstadisticas',
    header: 'Variables estadísticas',
    colspan: 5,
  },
];

export const COLUMNS_WITH_BORDER: string[] = [
  'rndVencida',
  'rndActualiza',
  'rndActualiza2',
  'proximaInformacion',
  'rndPaga',
  'rndCobro',
  'estadoCajaActualizacion',
  'estadoCajaInformacion',
  'estadoCajaCobro1',
  'estadoCajaCobro2',
  'estadoCajaCobro3',
  'colaActualizacion',
  'colaInformacion',
  'colaCobro',
  'acumPersonasNoPagan',
  'acumTiempoPermanPersonas',
  'cantPersonas',
  'acumTiempoEsperaColaCobro',
  'cantPersonasEsperaColaCobro',
];
