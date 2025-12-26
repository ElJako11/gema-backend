import { z } from 'zod';

export const createChecklistSchema = z.object({
  nombre: z.string().min(1).max(100),
});

export const updateChecklistSchema = z.object({
  nombre: z.string().min(1).max(100),
});

export const checklistIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
