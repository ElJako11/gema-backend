import { Router } from 'express';

import {
  getDetalleInspeccionHandler,
  createInspeccionHandler,
  deleteInspeccionHandler,
  getInspeccionesByFecha,
  getResumenInspeccionHandler,
  updateInspeccionHandler,
} from '../controllers/inspecciones/inspecciones.controller';

import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate.middleware';

import {
  inspeccionIdParamSchema,
  createInspeccionSchema,
  updateInspeccionSchema,
} from '../validations/inspeccionSchema';

import { QuerySchema } from '../validations/globalTypeSchema';

const router = Router();

router.get(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(inspeccionIdParamSchema),
  getDetalleInspeccionHandler
);
router.get(
  '/',
  authenticate,
  autorizationMiddleware(),
  validateQuery(QuerySchema),
  getInspeccionesByFecha
);
router.get('/resumen/:id', getResumenInspeccionHandler);

router.post(
  '/',
  authenticate,
  autorizationMiddleware(),
  validateBody(createInspeccionSchema),
  createInspeccionHandler
);

router.patch(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(inspeccionIdParamSchema),
  validateBody(updateInspeccionSchema),
  updateInspeccionHandler
);

router.delete(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(inspeccionIdParamSchema),
  deleteInspeccionHandler
);

export default router;
