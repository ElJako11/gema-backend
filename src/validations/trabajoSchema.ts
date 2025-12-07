import { z } from 'zod';
import { positiveIntId, positiveIntIdCoercion } from './globalTypeSchema';

const tipoTrabajoEnum = z.enum(['Mantenimiento', 'Inspeccion']);

export const createTrabajoSchema = z.object({
    idC: positiveIntId,
    idU: positiveIntId,
    nombre: z.string().min(1).max(100),
    fecha: z.date(),
    est: z.string().min(1).max(100),
    tipo: tipoTrabajoEnum,
});

const updateTrabajoBase = createTrabajoSchema.omit({
    idC: true,
    idU: true,
})

export const updateTrabajoSchema = updateTrabajoBase.partial().extend({
    idTrabajo: positiveIntIdCoercion,
});

export const urlParamsSchema = z.object({
  id: positiveIntIdCoercion,
});