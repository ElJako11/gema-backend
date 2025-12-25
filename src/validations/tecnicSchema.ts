import {z} from 'zod';
import { positiveIntId, positiveIntIdCoercion } from './globalTypeSchema';
import { id } from 'zod/v4/locales';

export const createTecnicoSchema = z.object({
    idGT: positiveIntId,
    nombre: z.string().min(1).max(50),
    correo: z.string().min(1).max(150),
});

const updateTecnicoBase = createTecnicoSchema.omit({});

export const updateTecnicoSchema = updateTecnicoBase.partial()

export const urlParamsTecnicoSchema = z.object({
  id: positiveIntIdCoercion,
});