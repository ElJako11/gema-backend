import {z} from 'zod';
import { positiveIntId, positiveIntIdCoercion } from './globalTypeSchema';

export const createTecnicoSchema = z.object({
    nombre: z.string().min(1).max(50),
    direccion: z.string().min(1).max(150),
});

const updateTecnicoBase = createTecnicoSchema.omit({});

export const updateTecnicoSchema = updateTecnicoBase.partial().extend({
    idTecnico: positiveIntIdCoercion,
});

export const urlParamsTecnicoSchema = z.object({
  id: positiveIntIdCoercion,
});