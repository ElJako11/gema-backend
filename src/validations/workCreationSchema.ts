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
  frecuencia: z
    .enum(['Diaria', 'Semanal', 'Mensual', 'Trimestral', 'Anual'])
    .optional(),
  tipo: z.enum(['Periodico', 'Condicion']),
  condicion: z.string().optional(),
  especificacion: z.string().optional(),
  instancia: z.string().optional(),
  nombre: z.string(),
});

export const createChecklistFromTemplateSchema = z.object({
  idMantenimiento: z.coerce.number(),
  idInspeccion: z.coerce.number(),
  idPlantilla: z.coerce.number().positive(),
});
