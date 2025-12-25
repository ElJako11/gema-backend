import { Router } from 'express';

import {
  getAllMantenimientoPreventivoHandler,
  getResumenMantenimientoHandler,
  postMantenimientoHandler,
  patchMantenimientoHandler,
  deleteMantenimientoHandler,
  getAllMantenimientoByFechaHandler,
} from '../controllers/mantenimientoPreventivo/mantenimientoPreventivo.controller';

import {
  validateBody,
  validateParams,
} from '../middleware/validate.middleware';

import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

import {
  createMantenimientoSchema,
  updateMantenimientoSchema,
  urlParamsSchema,
} from '../validations/mantenimientoPreventivo';

const router = Router();

/**
 * @openapi
 * /mantenimientos:
 *   get:
 *     summary: Obtiene la lista de mantenimientos preventivos.
 *     security:
 *        - bearerAuth: []
 *     tags:
 *       - Mantenimiento Preventivo
 *     responses:
 *       200:
 *         description: Lista de mantenimientos preventivos obtenida correctamente.
 *       500:
 *         description: Error al obtener mantenimientos preventivos.
 */

router.get(
  '/',
  authenticate,
  autorizationMiddleware(),
  getAllMantenimientoPreventivoHandler
);

/**
 * @openapi
 * /mantenimientos/filtros:
 *   get:
 *     summary: Obtiene la lista de mantenimientos preventivos filtrados por fecha.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Mantenimiento Preventivo
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: "2024-01-01"
 *         description: Fecha para filtrar los mantenimientos preventivos.
 *       - in: query
 *         name: filter
 *         required: true
 *         schema:
 *           type: string
 *           enum: [semanal, mensual]
 *           example: mensual
 *         description: Tipo de filtro a aplicar (semanal o mensual).
 *     responses:
 *       200:
 *         description: Lista de mantenimientos preventivos obtenida correctamente.
 *       500:
 *         description: Error al obtener mantenimientos preventivos.
 */
router.get(
  '/filtros',
  authenticate,
  autorizationMiddleware(),
  getAllMantenimientoByFechaHandler
);

/**
 * @openapi
 * /mantenimientos/{id}:
 *   get:
 *     summary: Obtiene el resumen de un mantenimiento preventivo por ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Mantenimiento Preventivo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del mantenimiento preventivo.
 *     responses:
 *       200:
 *         description: Resumen del mantenimiento preventivo obtenido correctamente.
 *       404:
 *         description: Mantenimiento preventivo no encontrado.
 *       500:
 *         description: Error al obtener el mantenimiento preventivo.
 */
router.get(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(urlParamsSchema),
  getResumenMantenimientoHandler
);

/**
 * @openapi
 * /mantenimientos:
 *   post:
 *     summary: Crea un nuevo mantenimiento preventivo.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Mantenimiento Preventivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idTrabajo
 *               - fechaLimite
 *               - prioridad
 *               - tipo
 *             properties:
 *               idTrabajo:
 *                 type: integer
 *                 example: 4
 *               fechaLimite:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *               prioridad:
 *                 type: string
 *                 example: "ALTA"
 *               resumen:
 *                 type: string
 *                 example: "Resumen del mantenimiento"
 *               tipo:
 *                 type: string
 *                 example: "Periodico"
 *               frecuencia:
 *                 type: string
 *                 example: "Mensual"
 *               instancia:
 *                 type: string
 *                 example: "Primera"
 *               condicion:
 *                 type: string
 *                 example: "Buena"
 *     responses:
 *       201:
 *         description: Mantenimiento preventivo creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                 mantenimientoId:
 *                   type: integer
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error al crear el mantenimiento preventivo.
 */


router.post(
  '/',
  authenticate,
  autorizationMiddleware(),
  validateBody(createMantenimientoSchema),
  postMantenimientoHandler
);


/**
 * @openapi
 * /mantenimientos/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un mantenimiento preventivo.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Mantenimiento Preventivo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del mantenimiento a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Campos opcionales para actualizar el mantenimiento.
 *             properties:
 *               fechaLimite:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *               prioridad:
 *                 type: string
 *                 example: "MEDIA"
 *               resumen:
 *                 type: string
 *                 example: "Actualización del resumen"
 *               tipo:
 *                 type: string
 *                 example: "Periodico"
 *               frecuencia:
 *                 type: string
 *                 example: "Mensual"
 *               instancia:
 *                 type: string
 *                 example: "Segunda"
 *               condicion:
 *                 type: string
 *                 example: "Regular"
 *     responses:
 *       200:
 *         description: Mantenimiento actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Mantenimiento no encontrado.
 *       500:
 *         description: Error al actualizar el mantenimiento preventivo.
 */


router.patch(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateBody(updateMantenimientoSchema),
  validateParams(urlParamsSchema),
  patchMantenimientoHandler
);

/**
 * @openapi
 * /mantenimientos/{id}:
 *   delete:
 *     summary: Elimina un mantenimiento preventivo por su ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Mantenimiento Preventivo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del mantenimiento a eliminar.
 *     responses:
 *       200:
 *         description: Mantenimiento eliminado correctamente.
 *       404:
 *         description: Mantenimiento no encontrado.
 *       500:
 *         description: Error al eliminar el mantenimiento preventivo.
 */


router.delete(
  '/:id',
  authenticate,
  autorizationMiddleware(),
  validateParams(urlParamsSchema),
  deleteMantenimientoHandler
);

export default router;
