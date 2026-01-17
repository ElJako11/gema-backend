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
  observacion: z.string().optional(),
  instancia: z.string().optional(),
  resumen: z.string().optional(),
  nombre: z.string(),
});

export const createChecklistFromTemplateSchema = z.object({
  idMantenimiento: z.coerce.number(),
  idInspeccion: z.coerce.number(),
  idPlantilla: z.coerce.number().positive(),
});

export const updateWorkSchema = z
  .object({
    // IDs como strings numéricos (se parsean en controlador)
    idMantenimiento: z.string().regex(/^\d+$/).optional(),
    idInspeccion: z.string().regex(/^\d+$/).optional(),

    // Campos comunes
    nombre: z.string().optional(),

    // Campos Mantenimiento
    tipo: z.enum(['Periodico', 'Condicion']).optional(),
    fechaLimite: z
      .string()
      .transform(str => new Date(str))
      .optional(),
    prioridad: z.enum(['ALTA', 'MEDIA', 'BAJA']).optional(),
    frecuencia: z
      .enum(['Diaria', 'Semanal', 'Mensual', 'Trimestral', 'Anual'])
      .optional(),
    resumen: z.string().optional(),

    // Campos Inspeccion
    observacion: z.string().optional(),
    // Frecuencia ya está definida arriba y es compartida
  })
  .refine(data => data.idMantenimiento || data.idInspeccion, {
    message: 'Debe proporcionar idMantenimiento o idInspeccion',
    path: ['idMantenimiento'],
  });
