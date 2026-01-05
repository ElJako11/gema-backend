import { Router } from 'express';
import * as controllers from '../controllers/trabajo/trabajo.controller';
import * as middleware from '../middleware/validate.middleware'
import * as validators from '../validations/trabajoSchema';
import {
    getCantidadMantenimientosReabiertosHandler,
    getMantenimientosReabiertosPorAreaHandler,
    getResumenMantenimientosMesHandler,
    getMantenimientosActivosPorAreaHandler
} from '../controllers/trabajo/trabajo.controller';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

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

router.get('/', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), controllers.getTrabajosHandler);

/**
 * @openapi
 * /trabajos/reabiertos:
 *   get:
 *     summary: Obtiene la cantidad de mantenimientos reabiertos en el mes actual
 *     tags:
 *       - Estadísticas
 *     responses:
 *       200:
 *         description: Cantidad de mantenimientos reabiertos
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *               example: 10
 *       500:
 *         description: Error al obtener la cantidad de mantenimientos
 */
router.get('/reabiertos', autorizationMiddleware(['DIRECTOR']), getCantidadMantenimientosReabiertosHandler);

/**
 * @openapi
 * /trabajos/reabiertos/por-area:
 *   get:
 *     summary: Obtiene la cantidad de mantenimientos reabiertos agrupados por grupo de trabajo
 *     tags:
 *       - Estadísticas
 *     responses:
 *       200:
 *         description: Lista de mantenimientos reabiertos por grupo de trabajo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Grupo:
 *                     type: string
 *                     example: "Grupo de Mantenimiento A"
 *                   total:
 *                     type: number
 *                     example: 5
 *       500:
 *         description: Error al obtener el reporte por área
 */
router.get('/reabiertos/por-area', autorizationMiddleware(['DIRECTOR']), getMantenimientosReabiertosPorAreaHandler);

/**
 * @openapi
 * /trabajos/resumen/mes-actual:
 *   get:
 *     summary: Obtiene un resumen de los mantenimientos del mes actual
 *     tags:
 *       - Estadísticas
 *     responses:
 *       200:
 *         description: Resumen de mantenimientos del mes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMantenimientos:
 *                   type: number
 *                   example: 20
 *                 completados:
 *                   type: number
 *                   example: 15
 *                 porcentajeCompletados:
 *                   type: number
 *                   example: 75
 *       500:
 *         description: Error al obtener el resumen del mes
 */
router.get('/resumen/mes-actual', autorizationMiddleware(['DIRECTOR', 'COORDINADOR']), getResumenMantenimientosMesHandler);

/**
 * @openapi
 * /trabajos/activos/por-area:
 *   get:
 *     summary: Obtiene la cantidad de mantenimientos activos agrupados por grupo de trabajo
 *     tags:
 *       - Estadísticas
 *     responses:
 *       200:
 *         description: Lista de mantenimientos activos por grupo de trabajo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   grupo:
 *                     type: string
 *                     example: "Grupo de Mantenimiento B"
 *                   total:
 *                     type: number
 *                     example: 8
 *       500:
 *         description: Error al obtener el reporte de activos por área
 */
router.get('/activos/por-area', autorizationMiddleware(['DIRECTOR', 'COORDINADOR']), getMantenimientosActivosPorAreaHandler);

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
router.get('/:id', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), middleware.validateParams(validators.urlParamsSchema), controllers.getTrabajoByIdHandler);

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

router.post('/', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), middleware.validateBody(validators.createTrabajoSchema), controllers.createTrabajoHandler);

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

router.patch('/:id', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), middleware.validateParams(validators.urlParamsSchema), middleware.validateBody(validators.updateTrabajoSchema), controllers.updateTrabajoHandler);

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

router.delete('/:id', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), middleware.validateParams(validators.urlParamsSchema), controllers.deleteTrabajoHandler);



export default router; 
