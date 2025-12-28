export type ResumenMantenimiento = {
  idMantenimiento: number;
  estado: string;
  ubicacion: string;
  fechaLimite: string;
  titulo: string;
};

export type createMantenimiento = {
  idTrabajo: number;
  fechaLimite: Date;
  prioridad: string;
  resumen?: string;
  tipo: string;
  frecuencia?: string;
  instancia?: string;
  condicion?: string;
};

export type updateMantenimiento = Partial<
  Omit<createMantenimiento, 'idTrabajo'>
>;

export type Actividad = {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'COMPLETADA' | 'PENDIENTE';
};

export type Checklist = {
  nombreMantenimiento: string;
  ubicacion: string;
  tareas: Actividad[];
};
