import { Router } from 'express';

import {
  getAllMantenimientoPreventivoHandler,
  getResumenMantenimientoHandler,
  postMantenimientoHandler,
  patchMantenimientoHandler,
  deleteMantenimientoHandler,
  getAllMantenimientoByFechaHandler,
} from '../controllers/mantenimientoPreventivo/mantenimientoPreventivo.controller';

import {
  validateBody,
  validateParams,
} from '../middleware/validate.middleware';

import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

import {
  createMantenimientoSchema,
  updateMantenimientoSchema,
  urlParamsSchema,
} from '../validations/mantenimientoPreventivo';

const router = Router();

router.get(
  '/',
  authenticate,
  autorizationMiddleware(),
  getAllMantenimientoPreventivoHandler
);

router.get(
  '/filtros',
  authenticate,
  autorizationMiddleware(),
  getAllMantenimientoByFechaHandler
);

router.get(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(urlParamsSchema),
  getResumenMantenimientoHandler
);

router.get(
  '/:id/checklist',
  authenticate,
  autorizationMiddleware(),
  validateParams(urlParamsSchema),
  getChecklistByMantenimientoHandler
);

router.post(
  '/',
  authenticate,
  autorizationMiddleware(),
  validateBody(createMantenimientoSchema),
  postMantenimientoHandler
);

router.patch(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateBody(updateMantenimientoSchema),
  validateParams(urlParamsSchema),
  patchMantenimientoHandler
);

router.delete(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(urlParamsSchema),
  deleteMantenimientoHandler
);

export default router;
