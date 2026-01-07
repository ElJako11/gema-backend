import { z } from 'zod';
import { positiveIntId } from './globalTypeSchema';

const idNumber = z.coerce.number().min(0);

export const createChecklistSchema = z.object({
  nombre: z.string().min(1).max(100),
  idMantenimiento: idNumber,
  idInspeccion: idNumber,
});

export const updateChecklistSchema = z.object({
  nombre: z.string().min(1).max(100),
});

export const checklistIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
