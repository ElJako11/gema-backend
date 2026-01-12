export type Trabajo = {
  tipoTrabajo: 'Mantenimiento' | 'Inspeccion';
  fechaCreacion: Date;
  idUbicacionTecnica: number;
  idGrupo: number;
  supervisorId: number;
  prioridad: 'Baja' | 'Media' | 'Alta';
  fechaLimite?: Date;
  frecuencia?: string;
  resumen?: string;
  tipoMantenimiento?: 'Periodico' | 'Condicion';
  condicion?: string;
  instancia?: string;
  observaciones?: string;
  nombre: string;
};

export type CreateChecklistTemplate = {
  idMantenimiento: number;
  idInspeccion: number;
  idPlantilla: number;
};
