import { Router } from 'express';
import { exportMaintenanceSummaryPdf } from '../controllers/pdfResumenMantenimientos/pdfResumenMantenimientos.controller';
import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware'; // Ojo con el nombre "autorization" vs "authorization"

const router = Router();

/**
 * @swagger
 * tags:
 *   name: PDF Resumen Mantenimientos
 *   description: Endpoints para la exportación a PDF de resúmenes de mantenimientos
 */

/**
 * @swagger
 * /pdf-mantenimientos/pdf-ResumenMantenimientos:
 *   get:
 *     summary: Exportar resumen de mantenimientos a PDF
 *     tags: [PDF Resumen Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha para filtrar el resumen de mantenimientos (YYYY-MM-DD)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [mensual, semanal]
 *         required: true
 *         description: Tipo de filtro a aplicar (mensual o semanal)
 *     responses:
 *       200:
 *         description: PDF del resumen de mantenimientos generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Error interno del servidor
 */
// Endpoint: /api/mantenimientos/export-pdf?date=2025-11-04&filter=mensual
router.get('/pdf-ResumenMantenimientos', authenticate, autorizationMiddleware(['DIRECTOR', 'COORDINADOR']), exportMaintenanceSummaryPdf);

export default router;