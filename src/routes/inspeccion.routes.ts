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

router.get('/:id', getDetalleInspeccionHandler);
router.get('/', getInspeccionesByFecha);
router.get('/resumen/:id', getResumenInspeccionHandler);

router.post('/', createInspeccionHandler);

router.patch('/:id', updateInspeccionHandler);

router.delete('/:id', deleteInspeccionHandler);

export default router;
