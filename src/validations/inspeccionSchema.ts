import { z } from 'zod';
import { positiveIntId } from './globalTypeSchema';

/**
 * Schema para validar los parámetros de la URL (id).
 */
export const inspeccionIdParamSchema = z.object({
  id: z.coerce
    .number()
    .int('El ID debe ser un entero')
    .positive('El ID debe ser un número positivo'),
});

/**
 * Schema para validar los query strings (date y filter).
 */

/**
 * Schema para validar la creación de una inspección (inserciones).
 * Valida el cuerpo de la petición.
 */
export const createInspeccionSchema = z.object({
  idTrabajo: positiveIntId,

  observaciones: z
    .string()
    .min(1, 'La observación debe tener al menos 1 carácter')
    .max(200, 'La observación no puede superar los 200 caracteres')
    .optional(),

  frecuencia: z
    .string()
    .min(1, 'La frecuencia es requerida')
    .max(100, 'La frecuencia no puede superar los 100 caracteres'),
});

const baseUpdate = createInspeccionSchema.omit({
  idTrabajo: true,
});

export const updateInspeccionSchema = baseUpdate.partial();
