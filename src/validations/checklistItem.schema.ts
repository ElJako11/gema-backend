import { z } from 'zod';

/**
 * Esquema para validar la creación de un item de checklist.
 * Utilizado para validar el body de la petición POST.
 */
export const createItemSchema = z.object({
  idChecklist: z.number().int().positive(),

  descripcion: z.string().min(1).max(100),

  titulo: z.string().min(1).max(100),
});

export const idParamSchema = z.object({
  idChecklist: z.coerce.number().int().positive(),
});

export const UpdateParamSchema = z.object({
  idChecklist: z.coerce.number().int().positive(),
  idItem: z.coerce.number().int().positive(),
});

const baseUpdate = createItemSchema.omit({
  idChecklist: true
})

export const UpdateBodySchema = baseUpdate.partial();
