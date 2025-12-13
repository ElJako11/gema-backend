import { Router } from 'express';
import * as controllers from '../controllers/trabajo/trabajo.controller';
import * as middleware from '../middleware/validate.middleware'
import * as validators from '../validations/trabajoSchema';

const router = Router();

//Get all Trabajos

/**
 * @openapi
 * /trabajos:
 *   get:
 *     summary: Obtiene la lista de mantenimientos preventivos.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajos
 *     responses:
 *       200:
 *         description: Lista de mantenimientos preventivos obtenida exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */

router.get('/', controllers.getTrabajosHandler);

//Get Trabajo by ID

/**
 * @openapi
 * /trabajos/{id}:
 *   get:
 *     summary: Obtiene un trabajo por su ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del trabajo a obtener.
 *     responses:
 *       200:
 *         description: Trabajo obtenido exitosamente.
 *       404:
 *         description: Trabajo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', middleware.validateParams(validators.urlParamsSchema), controllers.getTrabajoByIdHandler);

//Post Trabajo

/**
 * @openapi
 * /trabajos:
 *   post:
 *     summary: Crea un nuevo trabajo.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idC:
 *                 type: integer
 *                 example: 1
 *               idU:
 *                 type: integer
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 example: "Cambio de filtro de aire"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *               est:
 *                 type: string
 *                 example: "Pendiente"
 *               tipo:
 *                 type: string
 *                 enum: [Mantenimiento, Inspeccion]
 *                 example: Mantenimiento
 *             required:
 *               - idC
 *               - idU
 *               - nombre
 *               - fecha
 *               - est
 *               - tipo
 *     responses:
 *       201:
 *         description: Trabajo creado exitosamente.
 *       400:
 *         description: Solicitud inválida.
 *       500:
 *         description: Error interno del servidor.
 */

router.post('/', middleware.validateBody(validators.createTrabajoSchema), controllers.createTrabajoHandler);

//Patch Trabajo

/**
 * @openapi
 * /trabajos/{id}:
 *   patch:
 *     summary: Actualiza parcialmente un trabajo.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idC:
 *                 type: integer
 *                 example: 1
 *               idU:
 *                 type: integer
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 example: "Cambio de filtro de aire actualizado"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *               est:
 *                 type: string
 *                 example: "Pendiente"
 *               tipo:
 *                 type: string
 *                 enum: [Mantenimiento, Inspeccion]
 *                 example: Mantenimiento
 *             description: Campos opcionales para actualizar el trabajo.
 *     responses:
 *       200:
 *         description: Trabajo actualizado exitosamente.
 *       400:
 *         description: Solicitud inválida.
 *       404:
 *         description: Trabajo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */

router.patch('/:id', middleware.validateParams(validators.urlParamsSchema), middleware.validateBody(validators.updateTrabajoSchema), controllers.updateTrabajoHandler);

//Delete Trabajo

/**
 * @openapi
 * /trabajos/{id}:
 *   delete:
 *     summary: Elimina un trabajo por su ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabajos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo a eliminar.
 *     responses:
 *       200:
 *         description: Trabajo eliminado exitosamente.
 *       404:
 *         description: Trabajo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */

router.delete('/:id', middleware.validateParams(validators.urlParamsSchema), controllers.deleteTrabajoHandler);

export default router; 
