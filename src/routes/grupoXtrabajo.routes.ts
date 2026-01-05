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
import { autorizationMiddleware } from '../middleware/autorization.middleware';

const router = Router();

// 1. ASIGNAR Grupo a Trabajo (POST)
router.post(
    '/',
    autorizationMiddleware(['DIRECTOR', 'COORDINADOR']),
    validateBody(assignGrupoBodySchema),  // Valida el Body { idT, idG }
    assignGrupoHandler as unknown as RequestHandler
);

// 2. OBTENER Grupos asignados (GET)
router.get(
    '/:id',
    autorizationMiddleware(['DIRECTOR', 'COORDINADOR']),
    validateParams(urlIdParamSchema),     // Valida que :id sea número
    getGruposByTrabajoHandler as unknown as RequestHandler
);

// 3. DESASIGNAR Grupo (DELETE)
// Nota: Aquí usamos :idT para que coincida con unassignParamsSchema
router.delete(
    '/:idT/:idG', 
    autorizationMiddleware(['DIRECTOR', 'COORDINADOR']),
    validateParams(unassignParamsSchema), // Valida idT y idG
    deleteGrupoHandler as unknown as RequestHandler
);

export default router;