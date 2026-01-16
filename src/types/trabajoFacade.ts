export type Trabajo = {
  tipoTrabajo: 'Mantenimiento' | 'Inspeccion';
  fechaCreacion: Date;
  idUbicacionTecnica: number;
  idGrupo: number;
  supervisorId: number;
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  fechaLimite?: Date;
  frecuencia?: string;
  resumen?: string;
  tipo: 'Periodico' | 'Condicion';
  condicion?: string;
  instancia?: string;
  observacion?: string;
  nombre: string;
};

export type CreateChecklistTemplate = {
  idMantenimiento: number;
  idInspeccion: number;
  idPlantilla: number;
};
