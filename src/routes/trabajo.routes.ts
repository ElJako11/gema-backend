import { Router } from 'express';
import {
    createTrabajoHandler,
    deleteTrabajoHandler,
    getTrabajoByIdHandler,
    getTrabajosHandler,
    updateTrabajoHandler
} from '../controllers/trabajo/trabajo.controller';
import {
    validateBody,
    validateParams
} from '../middleware/validate.middleware'
import {
    urlParamsSchema,
    createTrabajoSchema,
    updateTrabajoSchema
} from '../validations/trabajoSchema';

const router = Router();

//Get all Trabajos
router.get('/', getTrabajosHandler);

//Get Trabajo by ID
router.get('/:id', validateParams(urlParamsSchema), getTrabajoByIdHandler);

//Post Trabajo
router.post('/', validateBody(createTrabajoSchema), createTrabajoHandler);

//Patch Trabajo
router.patch('/:id', validateParams(urlParamsSchema), validateBody(updateTrabajoSchema), updateTrabajoHandler);

//Delete Trabajo
router.delete('/:id', validateParams(urlParamsSchema), deleteTrabajoHandler);

export default router; 
