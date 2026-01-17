import { Router } from 'express';
import {
    executeMantenimientosHandler,
    executeInspeccionesHandler,
} from '../controllers/cron/cron.controller'; // Asegúrate que la ruta de importación de tus middlewares es correcta
import { autorizationMiddleware } from '../middleware/autorization.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Seguridad: Solo autenticados y con rol DIRECTOR
router.use(authenticate, autorizationMiddleware(['DIRECTOR']));

router.post('/mantenimientos', executeMantenimientosHandler);
router.post('/inspecciones', executeInspeccionesHandler);

export default router;