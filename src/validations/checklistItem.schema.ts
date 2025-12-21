import { z } from 'zod';

/**
 * Esquema para validar la creación de un item de checklist.
 * Utilizado para validar el body de la petición POST.
 */
export const createItemSchema = z.object({
  idChecklist: z.number().int().positive(),
  
  descripcion: z.string()
    .min(1)
    .max(100),
    
  titulo: z.string()
    .min(1)
    .max(100),
});

/**
 * Esquema para validar el parámetro ID en la URL.
 * Utilizado en funciones como getItemsChecklist.
 */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
