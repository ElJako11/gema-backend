export type CreateChecklistParams = {
  nombre: string;
  idMantenimiento?: number;
  idInspeccion?: number;
};

export type UpdateChecklistParams = Pick<CreateChecklistParams, 'nombre'>;
