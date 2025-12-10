import { Router } from 'express';

import tecnicoRoutes from './routes/tecnico.routes';
import grupoDeTrabajoRoutes from './routes/gruposDeTrabajo.routes';
import authRoutes from './routes/auth.routes';
import ubicacionesTecnicasRoutes from './routes/ubicacionesTecnicas.routes';
import trabajaEnGrupoRoutes from './routes/trabajaEnGrupo.routes';
import checklistRoutes from './routes/checklist.routes';
import trabajoRoutes from './routes/trabajo.routes';
import mantenimientoRoutes from './routes/mantenimientoPreventivo.routes';

import { authenticate } from './middleware/auth.middleware'; // Importa el middleware
import { autorizationMiddleware } from './middleware/autorization.middleware';

const router = Router();

// Protege la ruta de tecnicos
router.use('/tecnicos', authenticate, autorizationMiddleware(), tecnicoRoutes);

router.use(
  '/grupos',
  authenticate,
  autorizationMiddleware(),
  grupoDeTrabajoRoutes
);

router.use(
  '/trabajaEnGrupo',
  authenticate,
  autorizationMiddleware(),
  trabajaEnGrupoRoutes
);

router.use('/auth', authRoutes);

router.use(
  '/ubicaciones-tecnicas',
  authenticate,
  autorizationMiddleware(),
  ubicacionesTecnicasRoutes
);

router.use(
  '/checklists',
  authenticate,
  autorizationMiddleware(),
  checklistRoutes
);

router.use('/trabajos', authenticate, autorizationMiddleware(), trabajoRoutes);

router.use(
  '/mantenimientos',
  authenticate,
  autorizationMiddleware(),
  mantenimientoRoutes
);

export default router;
