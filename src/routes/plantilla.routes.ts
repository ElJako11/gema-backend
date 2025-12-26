import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  deletePlantillaHandler,
  getPlantillaHandler,
  getPlantillaWithItemsHandler,
  postPlantillaHandler,
  putPlantillaHandler,
} from '../controllers/plantilla/plantilla.controller';
import { autorizationMiddleware } from '../middleware/autorization.middleware';
import { validateBody, validateParams } from '../middleware/validate.middleware';
import { createPlantillaSchema, plantillaIdParamSchema, updatePlantillaSchema } from '../validations/plantillaSchema';

const router = Router();

router.get('/', authenticate, autorizationMiddleware(), getPlantillaHandler);

router.get(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(plantillaIdParamSchema),
  getPlantillaWithItemsHandler
);

router.post(
  '/', 
  authenticate, 
  autorizationMiddleware(), 
  validateBody(createPlantillaSchema), 
  postPlantillaHandler
);

router.put(
  '/:id', 
  authenticate, 
  autorizationMiddleware(), 
  validateParams(plantillaIdParamSchema), 
  validateBody(updatePlantillaSchema), 
  putPlantillaHandler
);

router.delete(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(plantillaIdParamSchema),
  deletePlantillaHandler
);

export default router;
