import { z } from 'zod';

export const createWorkSchema = z.object({
  tipoTrabajo: z.enum(['Mantenimiento', 'Inspeccion']),
  fechaCreacion: z.string().transform((str) => new Date(str)),
  idUbicacionTecnica: z.number().positive(),
  idGrupo: z.number().positive(),
  supervisorId: z.number().positive().optional(),
  prioridad: z.enum(['Alta', 'Media', 'Baja']),
  fechaLimite: z.string().transform((str) => new Date(str)),
  frecuencia: z.enum(['Diaria', 'Semanal', 'Mensual', 'Trimestral', 'Anual']),
  tipoMantenimiento: z.enum(['Periodico', 'Condicion']).optional(),
  condicion: z.string().optional(),
  especificacion: z.string().optional(),
  instancia: z.string().optional(),
});

export type CreateWorkInput = z.infer<typeof createWorkSchema>;
