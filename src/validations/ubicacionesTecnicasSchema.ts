import { z } from 'zod';

export const padreSchema = z.object({
  idPadre: z.coerce.number().int().min(1, 'idPadre inválido'),
  esUbicacionFisica: z.boolean().optional(),
  estaHabilitado: z.boolean().optional(),
});

export const createUbicacionSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida'),
  abreviacion: z.string().min(1, 'La abreviación es requerida'),
  padres: z.array(padreSchema).optional(),
});

export const updateUbicacionSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es requerida').optional(),
  abreviacion: z.string().min(1, 'La abreviación es requerida').optional(),
  padres: z.array(padreSchema).optional(),
  estaHabilitado: z.boolean().optional(),
});

export const idParamSchema = z.object({ id: z.coerce.number().int().min(1, 'ID inválido') });
export const idHijoParamSchema = z.object({ idHijo: z.coerce.number().int().min(1, 'ID inválido') });
export const nivelParamSchema = z.object({ nivel: z.coerce.number().int().min(0, 'Nivel inválido') });
export const ramasQuerySchema = z.object({ nivel: z.coerce.number().int().min(0).optional() });

export type TCreateUbicacion = z.infer<typeof createUbicacionSchema>;
export type TUpdateUbicacion = z.infer<typeof updateUbicacionSchema>;
