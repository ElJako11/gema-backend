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
  supervisor: string | null;
  observaciones: string;
  frecuencia: string;
  areaEncargada: string;
  titulo: string;
  abreviacion: string;
  codigoVerificacion: string;
};

export type ResumenInspeccion = Pick<
  Inspeccion,
  | 'idInspeccion'
  | 'fechaCreacion'
  | 'ubicacion'
  | 'estado'
  | 'areaEncargada'
  | 'supervisor'
  | 'frecuencia'
  | 'titulo'
>;

export type insertInspeccion = {
  idTrabajo: number;
  observaciones: string;
  frecuencia: string;
  fechaProximaGeneracion?: string | Date;
};

export type putInspeccion = Partial<Omit<Inspeccion, 'idInspeccion'>>;

export type Actividad = {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'COMPLETADA' | 'PENDIENTE';
};

export type Checklist = {
  id: number;
  idTrabajo: number;
  titulo: string;
  ubicacion: string;
  tareas: Actividad[];
};
