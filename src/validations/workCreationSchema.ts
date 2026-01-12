import { z } from 'zod';

export const createWorkSchema = z.object({
  tipoTrabajo: z.enum(['Mantenimiento', 'Inspeccion']),
  nombre: z.string().min(1, 'El nombre del trabajo es obligatorio'),
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
  condicion: z.string().optional(),
  resumen: z.string().optional(),
  observaciones: z.string().optional(),
  especificacion: z.string().optional(),
  instancia: z.string().optional(),
  observacion: z.string().min(1).optional(),
});

export const createChecklistFromTemplateSchema = z.object({
  idMantenimiento: z.coerce.number(),
  idInspeccion: z.coerce.number(),
  idPlantilla: z.coerce.number().positive(),
});
