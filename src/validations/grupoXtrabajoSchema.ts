import { z } from 'zod';
import { positiveIntIdCoercion } from './globalTypeSchema'; // Asumo que tienes esto

// 1. Para validar cuando solo viene un ID en la URL (ej: /trabajos/:id/grupos)
// IMPORTANTE: La clave debe llamarse 'id' porque en la ruta usas :id
export const urlIdParamSchema = z.object({
    id: positiveIntIdCoercion,
});

// 2. Para el Body del POST (Solo enviamos el ID del grupo, el del trabajo ya está en la URL)
export const assignGrupoBodySchema = z.object({
    idG: positiveIntIdCoercion,
});

// 3. Para el DELETE (Aquí recibimos DOS IDs en la URL)
// Ruta: /trabajos/:idT/grupos/:idG
export const unassignParamsSchema = z.object({
    idT: positiveIntIdCoercion,
    idG: positiveIntIdCoercion,
});