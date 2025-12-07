import { z } from 'zod';
import { positiveIntId, positiveIntIdCoercion} from './globalTypeSchema';

export const createChecklistSchema = z.object({
    nombre: z.string().min(1).max(50),
});

const updateChecklistBase = createChecklistSchema.omit({});

export const updateChecklistSchema = updateChecklistBase.partial().extend({
    idChecklist: positiveIntIdCoercion,
});

export const urlParamsSchema = z.object({
  id: positiveIntId,
});