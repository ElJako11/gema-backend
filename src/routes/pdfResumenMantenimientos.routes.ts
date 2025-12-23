import { Router } from 'express';
import { exportMaintenanceSummaryPdf } from '../controllers/pdfResumenMantenimientos/pdfResumenMantenimientos.controller';
import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware'; // Ojo con el nombre "autorization" vs "authorization"

const router = Router();

// Endpoint: /api/mantenimientos/export-pdf?date=2025-11-04&filter=mensual
router.get('/pdf-ResumenMantenimientos', authenticate, autorizationMiddleware(), exportMaintenanceSummaryPdf);

export default router;