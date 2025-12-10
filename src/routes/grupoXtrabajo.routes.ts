import { Router } from 'express';
import { RequestHandler } from 'express';
import {
    assignGrupoHandler,
    getGruposByTrabajoHandler,
    deleteGrupoHandler
} from '../controllers/grupoXtrabajo/grupoXtrabajo.controller';
import {
    validateParams,
    validateBody
} from '../middleware/validate.middleware';
import {
    urlIdParamSchema,       
    assignGrupoBodySchema,  
    unassignParamsSchema
} from '../validations/grupoXtrabajoSchema';

const router = Router();

// 1. ASIGNAR Grupo a Trabajo (POST)
router.post(
    '/trabajos/:id/grupos',
    validateParams(urlIdParamSchema),     // Valida que :id sea número
    validateBody(assignGrupoBodySchema),  // Valida que el body tenga { idG: ... }
    assignGrupoHandler as unknown as RequestHandler
);

// 2. OBTENER Grupos asignados (GET)
router.get(
    '/trabajos/:id/grupos',
    validateParams(urlIdParamSchema),     // Valida que :id sea número
    getGruposByTrabajoHandler as unknown as RequestHandler
);

// 3. DESASIGNAR Grupo (DELETE)
// Nota: Aquí usamos :idT para que coincida con unassignParamsSchema
router.delete(
    '/trabajos/:idT/grupos/:idG', 
    validateParams(unassignParamsSchema), // Valida idT y idG
    deleteGrupoHandler as unknown as RequestHandler
);

export default router;