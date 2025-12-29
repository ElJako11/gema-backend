import { Router } from "express";
import {
    getMantenimientosXInspeccion,
    getMantenimientoXInspeccion,
    getMantXInspResumenHandler,
    createMantenimientoXInspeccionHandler,
    updateMantenimientoXInspeccionHandler,
    deleteMantenimientoXInspeccionHandler
} from "../controllers/mantenimientoXinspeccion/mantenimientoXinspeccion.controller";
import { 
    validateBody,
    validateParams
} from '../middleware/validate.middleware';
import {
    createMantenimientoXInspeccionSchema,
    updateMantenimientoXInspeccionSchema,
    urlParamsSchema
} from '../validations/mantenimientoXinspeccionSchema';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: MantenimientosPorInspeccion
 *   description: Endpoints para la relación entre mantenimientos e inspecciones
 */

/**
 * @swagger
 * /mantenimientosXinspeccion:
 *   get:
 *     summary: Obtener todas las relaciones de mantenimientos por inspección
 *     tags: [MantenimientosPorInspeccion]
 *     responses:
 *       200:
 *         description: Lista obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
//Get all MantenimientosXInspeccion
router.get('/', getMantenimientosXInspeccion);

/**
 * @swagger
 * /mantenimientosXinspeccion/resumen:
 *   get:
 *     summary: Obtener un resumen de mantenimientos por inspección
 *     tags: [MantenimientosPorInspeccion]
 *     responses:
 *       200:
 *         description: Resumen obtenido exitosamente
 *       500:
 *         description: Error interno del servidor
 */
//Get MantXInsp Resumen
router.get('/resumen', getMantXInspResumenHandler);

/**
 * @swagger
 * /mantenimientosXinspeccion/{id}:
 *   get:
 *     summary: Obtener una relación de mantenimiento por inspección por su ID
 *     tags: [MantenimientosPorInspeccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la relación
 *     responses:
 *       200:
 *         description: Relación encontrada
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
//Get MantenimientoXInspeccion by ID
router.get('/:id', validateParams(urlParamsSchema), getMantenimientoXInspeccion);

/**
 * @swagger
 * /mantenimientosXinspeccion:
 *   post:
 *     summary: Crear una nueva relación de mantenimiento por inspección
 *     tags: [MantenimientosPorInspeccion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idInspeccion:
 *                 type: integer
 *                 example: 1
 *               nombre:
 *                 type: string
 *                 example: "Mantenimiento Adicional"
 *     responses:
 *       201:
 *         description: Relación creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
//Post MantenimientoXInspeccion
router.post('/', validateBody(createMantenimientoXInspeccionSchema), createMantenimientoXInspeccionHandler);

/**
 * @swagger
 * /mantenimientosXinspeccion/{id}:
 *   patch:
 *     summary: Actualizar una relación de mantenimiento por inspección
 *     tags: [MantenimientosPorInspeccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la relación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idInspeccion:
 *                 type: integer
 *                 example: 2
 *               nombre:
 *                 type: string
 *                 example: "Mantenimiento Adicional - Actualizado"
 *     responses:
 *       200:
 *         description: Relación actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
//Patch MantenimientoXInspeccion
router.patch('/:id', validateParams(urlParamsSchema), validateBody(updateMantenimientoXInspeccionSchema), updateMantenimientoXInspeccionHandler);

/**
 * @swagger
 * /mantenimientosXinspeccion/{id}:
 *   delete:
 *     summary: Eliminar una relación de mantenimiento por inspección
 *     tags: [MantenimientosPorInspeccion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la relación
 *     responses:
 *       200:
 *         description: Relación eliminada exitosamente
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
//Delete MantenimientoXInspeccion
router.delete('/:id', validateParams(urlParamsSchema), deleteMantenimientoXInspeccionHandler);

export default router;