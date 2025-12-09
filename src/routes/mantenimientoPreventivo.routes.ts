import { Router } from 'express';

import {
  getAllMantenimientoPreventivoHandler,
  getResumenMantenimientoHandler,
  postMantenimientoHandler,
  patchMantenimientoHandler,
  deleteMantenimientoHandler,
} from '../controllers/mantenimientoPreventivo/mantenimientoPreventivo.controller';

import {
  validateBody,
  validateParams,
} from '../middleware/validate.middleware';

import {
  createMantenimientoSchema,
  updateMantenimientoSchema,
  urlParamsSchema,
} from '../validations/mantenimientoPreventivo';

const router = Router();

router.get('/', getAllMantenimientoPreventivoHandler);
router.get(
  '/:id',
  validateParams(urlParamsSchema),
  getResumenMantenimientoHandler
);

router.post(
  '/',
  validateBody(createMantenimientoSchema),
  postMantenimientoHandler
);

router.patch(
  '/:id',
  validateBody(updateMantenimientoSchema),
  validateParams(urlParamsSchema),
  patchMantenimientoHandler
);

router.delete(
  '/:id',
  validateParams(urlParamsSchema),
  deleteMantenimientoHandler
);

export default router;
