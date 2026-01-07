export type CreateChecklistParams = {
  nombre: string;
  idMantenimiento: string;
  idInspeccion: string;
};

export type UpdateChecklistParams = Pick<CreateChecklistParams, 'nombre'>;
