import { z } from 'zod';

export const createItemSchema = z.object({
    idItemPlantilla: z.number().int().positive().optional(),
    idPlantilla: z.number().int().positive(),
    descripcion: z.string().min(1).max(200),
    titulo: z.string().min(1).max(100),
});

export const updateItemSchema = createItemSchema.omit({
    idItemPlantilla: true,
    idPlantilla: true,
}).partial();

export const urlParamsSchema = z.object({
    idItemPlantilla: z.coerce.number().int().positive(),
    idPlantilla: z.coerce.number().int().positive(),
});

export const plantillaIdParamSchema = z.object({
    idPlantilla: z.coerce.number().int().positive(),
})
