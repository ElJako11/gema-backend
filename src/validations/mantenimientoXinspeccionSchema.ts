import { z } from 'zod';
import { positiveIntId, positiveIntIdCoercion } from './globalTypeSchema';

export const createMantenimientoXInspeccionSchema = z.object({
    idInspeccion: positiveIntId,
    nombre: z.string().min(1).max(100),
});

export const updateMantenimientoXInspeccionSchema = createMantenimientoXInspeccionSchema.partial();

export const urlParamsSchema = z.object({
  id: positiveIntIdCoercion,
});