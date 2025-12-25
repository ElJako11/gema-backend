import { Router } from 'express';

import {
  getDetalleInspeccionHandler,
  createInspeccionHandler,
  deleteInspeccionHandler,
  getInspeccionesByFecha,
  getResumenInspeccionHandler,
  updateInspeccionHandler,
} from '../controllers/inspecciones/inspecciones.controller';

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
router.get(
  '/resumen/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(inspeccionIdParamSchema),
  getResumenInspeccionHandler
);

router.get(
  '/:id/checklist',
  authenticate,
  autorizationMiddleware(),
  validateParams(inspeccionIdParamSchema),
  getTareasChecklistHandler
);

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
