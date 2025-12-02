// src/schemas/tecnico.schema.ts

import { z } from 'zod';

/**
 * Esquema para validar la creación de un nuevo Técnico.
 * Sigue el patrón de usar .min(1) para garantizar que el campo no sea ni faltante ni vacío.
 */
export const createTecnicoSchema = z.object({
  // Validación para el Nombre
  // Asegura que el campo exista y que la cadena no esté vacía.
  Nombre: z
    .string()
    .min(1, 'El nombre es obligatorio y no puede estar vacío.')
    .min(2, 'El nombre debe tener al menos 2 caracteres.'), // Regla adicional de longitud
  
  // Validación para el Correo
  // Asegura que el campo exista, no esté vacío, y sea un formato de email válido.
  Correo: z
    .string()
    .min(1, 'El correo electrónico es obligatorio.')
    .email('El formato del correo es inválido.'),
});

// Exportar el tipo inferido para usar en los controladores (Type Safety)
export type TCreateTecnico = z.infer<typeof createTecnicoSchema>;