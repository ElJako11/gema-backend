import { z } from 'zod';
import { positiveIntId } from './globalTypeSchema'; 

export const assignGrupoToTrabajoSchema = z.object({
    idG: positiveIntId, // ID del Grupo
    idT: positiveIntId  // ID del Trabajo
});

// Para el DELETE, como suele ir en la URL, quizás necesites params:
// DELETE /trabajos/:idT/grupos/:idG
export const unassignParamsSchema = z.object({
    idT: z.coerce.number().int().positive(),
    idG: z.coerce.number().int().positive(),
});