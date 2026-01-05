import { Router } from 'express';

import { getAllEventosByFechaHandler } from '../controllers/calendario/calendario.controller';
import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Calendario
 *   description: Endpoints para la consulta de eventos del calendario
 */

/**
 * @swagger
 * /calendario:
 *   get:
 *     summary: Obtener eventos del calendario
 *     security:
 *       - bearerAuth: []
 *     tags: [Calendario]
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha para filtrar eventos (YYYY-MM-DD)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [mensual, semanal]
 *         required: true
 *         description: El tipo de filtro a aplicar (mensual o semanal).
 *     responses:
 *       200:
 *         description: Lista de eventos obtenida exitosamente
 *       400:
 *         description: Solicitud inválida. Parámetros faltantes o incorrectos.
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/',
  authenticate,
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']),
  getAllEventosByFechaHandler
);

export default router;
