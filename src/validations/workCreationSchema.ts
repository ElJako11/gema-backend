import { z } from 'zod';

export const createWorkSchema = z.object({
  tipoTrabajo: z.enum(['Mantenimiento', 'Inspeccion']),
  fechaCreacion: z.string().transform(str => new Date(str)),
  idUbicacionTecnica: z.number().positive(),
  idGrupo: z.number().positive(),
  supervisorId: z.number().positive().optional(),
  prioridad: z.enum(['ALTA', 'MEDIA', 'BAJA']),
  fechaLimite: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  frecuencia: z.enum(['Diaria', 'Semanal', 'Mensual', 'Trimestral', 'Anual']),
  tipoMantenimiento: z.enum(['Periodico', 'Condicion']).optional(),
  condicion: z.string().min(1).optional(),
  observacion: z.string().min(1).optional(),
  instancia: z.string().min(1).optional(),
  nombre: z.string().min(1),
});

export const createChecklistFromTemplateSchema = z.object({
  idMantenimiento: z.coerce.number(),
  idInspeccion: z.coerce.number(),
  idPlantilla: z.coerce.number().positive(),
});
