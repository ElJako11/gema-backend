import { Router } from 'express';
import tecnicoRoutes from './routes/tecnic.routes';
import usuarioRoutes from './routes/usuario.routes';
import grupoDeTrabajoRoutes from './routes/gruposDeTrabajo.routes';
import authRoutes from './routes/auth.routes';
import ubicacionesTecnicasRoutes from './routes/ubicacionesTecnicas.routes';
import trabajaEnGrupoRoutes from './routes/trabajaEnGrupo.routes';
import checklistRoutes from './routes/checklist.routes';
import trabajoRoutes from './routes/trabajo.routes';
import mantenimientoRoutes from './routes/mantenimientoPreventivo.routes';
import inspeccionRoutes from './routes/inspeccion.routes';
import calendarioRoutes from './routes/calendario.routes';
import mantenimientoXinspeccionRoutes from './routes/mantenimientoXinspeccion.routes';

import { authenticate } from './middleware/auth.middleware'; // Importa el middleware
import { autorizationMiddleware } from './middleware/autorization.middleware';
import itemChecklistRoutes from './routes/itemChecklist.routes';
import plantillaRoutes from './routes/plantilla.routes';
import itemPlantillaRoutes from './routes/itemPlantilla.routes';

const router = Router();

// Protege la ruta de usuarios
router.use(
  '/usuarios', 
  authenticate, 
  autorizationMiddleware(), 
  usuarioRoutes
);

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

router.use(
  '/inspecciones',
  authenticate,
  autorizationMiddleware(),
  inspeccionRoutes
);

router.use(
  '/calendario',
  authenticate,
  autorizationMiddleware(),
  calendarioRoutes
);

router.use(
  '/item-checklist',
  authenticate,
  autorizationMiddleware(),
  itemChecklistRoutes
);

router.use(
  '/plantillas',
  authenticate,
  autorizationMiddleware(),
  plantillaRoutes
);

router.use(
  '/item-plantilla',
  authenticate,
  autorizationMiddleware(),
  itemPlantillaRoutes
);

router.use(
  '/mantenimientosXinspeccion',
  authenticate,
  autorizationMiddleware(),
  mantenimientoXinspeccionRoutes
);

router.use(
  '/tecnicos',
  authenticate,
  autorizationMiddleware(),
  tecnicoRoutes
);

export default router;
