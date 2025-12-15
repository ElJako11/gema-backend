export type ResumenMantenimiento = {
  idMantenimiento: number;
  estado: string;
  ubicacion: string;
  fechaLimite: string;
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
