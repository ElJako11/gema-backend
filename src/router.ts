import { Router } from 'express';
import tecnicoRoutes from './routes/tecnico.routes';
import grupoDeTrabajoRoutes from './routes/gruposDeTrabajo.routes';
import authRoutes from './routes/auth.routes';
import ubicacionesTecnicasRoutes from './routes/ubicacionesTecnicas.routes';
import { authenticate } from './middleware/auth.middleware'; // Importa el middleware
import trabajaEnGrupoRoutes from './routes/trabajaEnGrupo.routes';
const router = Router();

// Protege la ruta de tecnicos
router.use('/tecnicos', authenticate([]), tecnicoRoutes);
router.use('/grupos', authenticate([]), grupoDeTrabajoRoutes);
router.use('/trabajaEnGrupo', authenticate([]), trabajaEnGrupoRoutes);
router.use('/login', authRoutes);
router.use(
  '/ubicaciones-tecnicas',
  authenticate([]),
  ubicacionesTecnicasRoutes
);
export default router;
