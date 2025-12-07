import { Router } from 'express';
import * as controllers from '../controllers/trabajo/trabajo.controller';
import * as middleware from '../middleware/validate.middleware'
import * as validators from '../validations/trabajoSchema';

const router = Router();

//Get all Trabajos
router.get('/', controllers.getTrabajosHandler);

//Get Trabajo by ID
router.get('/:id', middleware.validateParams(validators.urlParamsSchema), controllers.getTrabajoByIdHandler);

//Post Trabajo
router.post('/', middleware.validateBody(validators.createTrabajoSchema), controllers.createTrabajoHandler);

//Put Trabajo
router.put('/:id', middleware.validateParams(validators.urlParamsSchema), middleware.validateBody(validators.updateTrabajoSchema), controllers.updateTrabajoHandler);

//Delete Trabajo
router.delete('/:id', middleware.validateParams(validators.urlParamsSchema), controllers.deleteTrabajoHandler);

export default router; 
