import { z } from 'zod';
import { positiveIntId, positiveIntIdCoercion } from './globalTypeSchema';

const prioridadEnum = z.enum(['BAJA', 'MEDIA', 'ALTA']);
const tipoEnum = z.enum(['Periodico', 'Condicion']);

export const createMantenimientoSchema = z.object({
  idTrabajo: positiveIntId,
  // Accept strings (ISO) or Date objects by coercing to Date
  fechaLimite: z.coerce.date().min(new Date()),
  prioridad: prioridadEnum,
  resumen: z.string().min(1).max(250),
  tipo: tipoEnum,
  frecuencia: z.string().min(1).optional(),
  instancia: z.string().min(1).optional(),
  condicion: z.string().min(1).max(100).optional(),
});

const baseUpdate = createMantenimientoSchema.omit({
  idTrabajo: true,
});

export const updateMantenimientoSchema = baseUpdate.partial().extend({
  idMantenimiento: positiveIntIdCoercion,
});

export const urlParamsSchema = z.object({
  id: positiveIntIdCoercion,
});
