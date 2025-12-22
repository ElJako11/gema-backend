import { Router } from 'express';

import {
  getResumenMantenimientoHandler,
  postMantenimientoHandler,
  patchMantenimientoHandler,
  deleteMantenimientoHandler,
  getAllMantenimientoByFechaHandler,
  getChecklistByMantenimientoHandler,
  getMantenimientobyIDHandler,
} from '../controllers/mantenimientoPreventivo/mantenimientoPreventivo.controller';

import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate.middleware';

import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

import {
  createMantenimientoSchema,
  updateMantenimientoSchema,
  urlParamsSchema,
} from '../validations/mantenimientoPreventivo';
import { QuerySchema } from '../validations/globalTypeSchema';

const router = Router();

router.get(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(urlParamsSchema),
  getMantenimientobyIDHandler
)

router.get(
  '/filtros',
  authenticate,
  autorizationMiddleware(),
  validateQuery(QuerySchema),
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
