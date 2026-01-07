import { z } from 'zod';
import { positiveIntId } from './globalTypeSchema';

export const createChecklistSchema = z.object({
  nombre: z.string().min(1).max(100),
  idMantenimiento: positiveIntId.optional(),
  idInspeccion: positiveIntId.optional(),
});

export const updateChecklistSchema = z.object({
  nombre: z.string().min(1).max(100),
});

export const checklistIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
