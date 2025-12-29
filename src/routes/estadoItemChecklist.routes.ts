import { Router } from 'express';
import { 
    postEstadoItemHandler, 
    patchEstadoItemHandler,
    getEstadoItemHandler,
    deleteEstadoItemHandler
} from '../controllers/estadoItemChecklist/estadoItemChecklist.controller';

// Asumo que tienes middlewares para validar body y params. 
// Si usas uno solo genérico, ajústalo aquí.
import { validateBody, validateParams } from '../middleware/validate.middleware'; 
import { 
    createEstadoItemSchema, 
    estadoItemParamsSchema 
} from '../validations/estadoItemChecklistSchema';

const router = Router();

// GET: /api/estado-item/1/2/3
router.get(
    '/:idTrabajo/:idChecklist/:idItemChecklist',
    validateParams(estadoItemParamsSchema),
    getEstadoItemHandler
);

// POST: /api/estado-item (Body completo)
router.post(
    '/', 
    validateBody(createEstadoItemSchema), 
    postEstadoItemHandler
);

// PATCH: /api/estado-item/1/2/3
router.patch(
    '/:idTrabajo/:idChecklist/:idItemChecklist', 
    validateParams(estadoItemParamsSchema),     // Valida que sean números en la URL
    patchEstadoItemHandler
);

// DELETE: /api/estado-item/1/2/3
router.delete(
    '/:idTrabajo/:idChecklist/:idItemChecklist',
    validateParams(estadoItemParamsSchema),
    deleteEstadoItemHandler
);

export default router;