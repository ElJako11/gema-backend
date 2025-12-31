import { Router } from 'express';
import { exportChecklistPdf } from '../controllers/pdfChecklist/pdfChecklist.controller';
import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

const router = Router();

/**
 * @swagger
 * /pdf-checklists/{id}/pdf:
 *   get:
 *     summary: Exportar un checklist a PDF
 *     tags: [Checklist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del checklist a exportar
 *     responses:
 *       200:
 *         description: PDF del checklist generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Checklist no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id/pdf', authenticate, autorizationMiddleware(), exportChecklistPdf);

export default router;