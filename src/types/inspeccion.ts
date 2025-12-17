export enum estadoEnum {
  'No empezado',
  'En Ejecucion',
  'Reprogramado',
  'Culminado',
}

export type Inspeccion = {
  idInspeccion: number;
  fechaCreacion: string;
  ubicacion: string;
  estado: estadoEnum | string;
  supervisor: string;
  observaciones: string;
  frecuencia: string;
  areaEncargada: string;
};

export type ResumenInspeccion = Pick<
  Inspeccion,
  | 'idInspeccion'
  | 'ubicacion'
  | 'estado'
  | 'areaEncargada'
  | 'supervisor'
  | 'frecuencia'
>;

export type insertInspeccion = {
  idTrabajo: number;
  observaciones: string;
  frecuencia: string;
};

export type putInspeccion = Partial<Omit<Inspeccion, 'idInspeccion'>>;
