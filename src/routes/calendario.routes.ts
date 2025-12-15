import { Router } from 'express';

import { getAllEventosByFechaHandler } from '../controllers/calendario/calendario.controller';
import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

const router = Router();

router.get('/', getAllEventosByFechaHandler);

export default router;
