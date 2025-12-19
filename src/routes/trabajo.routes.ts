import { Router } from 'express';
import * as controllers from '../controllers/trabajo/trabajo.controller';
import * as middleware from '../middleware/validate.middleware'
import * as validators from '../validations/trabajoSchema';
import {
    getCantidadMantenimientosReabiertosHandler
} from '../controllers/trabajo/trabajo.controller';

const router = Router();

//Get all Trabajos
router.get('/', controllers.getTrabajosHandler);

router.get('/reabiertos', getCantidadMantenimientosReabiertosHandler);

//Get Trabajo by ID
router.get('/:id', middleware.validateParams(validators.urlParamsSchema), controllers.getTrabajoByIdHandler);

//Post Trabajo
router.post('/', middleware.validateBody(validators.createTrabajoSchema), controllers.createTrabajoHandler);

//Patch Trabajo
router.patch('/:id', middleware.validateParams(validators.urlParamsSchema), middleware.validateBody(validators.updateTrabajoSchema), controllers.updateTrabajoHandler);

//Delete Trabajo
router.delete('/:id', middleware.validateParams(validators.urlParamsSchema), controllers.deleteTrabajoHandler);



export default router; 
