import { z } from 'zod';

export const createPlantillaSchema = z.object({
  nombre: z.string().min(1).max(100),
});

export const updatePlantillaSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
});

export const plantillaIdParamSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: 'idPlantilla debe ser un entero positivo',
  }),
});
