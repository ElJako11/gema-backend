import { Router } from 'express';

import {
  getDetalleInspeccionHandler,
  createInspeccionHandler,
  deleteInspeccionHandler,
  getInspeccionesByFecha,
  getResumenInspeccionHandler,
  updateInspeccionHandler,
} from '../controllers/inspecciones/inspecciones.controller';

const router = Router();

/**
 * @openapi
 * /inspecciones/{id}:
 *   get:
 *     summary: Obtener detalle de inspección por ID
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Inspeccion
 *     description: Obtiene el detalle de la inspección correspondiente al ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la inspección a obtener.
 *
 *     responses:
 *       '200':
 *         description: Detalle de la inspección obtenido exitosamente.
 *       '404':
 *         description: No se encontró una inspección asociada a ese ID.
 *       '500':
 *         description: Error interno del servidor.
 */

router.get('/:id', getDetalleInspeccionHandler);

/**
 * @openapi
 * /inspecciones:
 *   get:
 *     summary: Obtener inspecciones por fecha
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Inspeccion
 *     description: Obtiene una lista de inspecciones filtradas por fecha.
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: La fecha para filtrar las inspecciones (formato AAAA-MM-DD).
 *
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [mensual, diario]
 *         required: true
 *         description: El tipo de filtro a aplicar (mensual o diario).
 *
 *     responses:
 *       '200':
 *         description: Lista de inspecciones obtenidas exitosamente.
 *       '400':
 *         description: Solicitud inválida. Parámetros faltantes o incorrectos.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', getInspeccionesByFecha);

/**
 * @openapi
 * /inspecciones/resumen/{id}:
 *   get:
 *     summary: Obtener resumen de inspección por ID
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Inspeccion
 *     description: Obtiene un resumen de la inspección correspondiente al ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la inspección a obtener el resumen.
 *
 *     responses:
 *       '200':
 *         description: Resumen de la inspección obtenido exitosamente.
 *       '404':
 *         description: No se encontró una inspección asociada a ese ID.
 *       '500':
 *         description: Error interno del servidor.
 */

router.get('/resumen/:id', getResumenInspeccionHandler);

/**
 * @openapi
 * /inspecciones:
 *   post:
 *     summary: Crear una nueva inspección
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Inspeccion
 *     description: Crea una nueva inspección con los datos proporcionados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idTrabajo:
 *                 type: integer
 *                 example: 1
 *               observaciones:
 *                 type: string
 *                 example: "Inspección inicial"
 *               frecuencia:
 *                 type: string
 *                 example: "Mensual"
 *             required:
 *               - idTrabajo
 *               - observaciones
 *               - frecuencia
 *
 *     responses:
 *       '201':
 *         description: Inspección creada exitosamente.
 *       '400':
 *         description: Solicitud inválida. Datos faltantes o incorrectos.
 *       '500':
 *         description: Error interno del servidor.
 */

router.post('/', createInspeccionHandler);

/**
 * @openapi
 * /inspecciones/{id}:
 *   patch:
 *     summary: Actualizar una inspección existente
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Inspeccion
 *     description: Actualiza los detalles de una inspección existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la inspección a actualizar.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaCreacion:
 *                 type: string
 *                 example: "2023-10-01T10:00:00Z"
 *               ubicacion:
 *                 type: string
 *                 example: "Edificio A"
 *               estado:
 *                 type: string
 *                 example: "En Ejecucion"
 *               supervisor:
 *                 type: string
 *                 example: "Juan Perez"
 *               observaciones:
 *                 type: string
 *                 example: "Inspección en progreso"
 *               frecuencia:
 *                 type: string
 *                 example: "Semanal"
 *               areaEncargada:
 *                 type: string
 *                 example: "Mantenimiento"
 *
 *     responses:
 *       '200':
 *         description: Inspección actualizada exitosamente.
 *       '400':
 *         description: Solicitud inválida. Datos faltantes o incorrectos.
 *       '404':
 *         description: No se encontró una inspección asociada a ese ID.
 *       '500':
 *         description: Error interno del servidor.
 */


router.patch('/:id', updateInspeccionHandler);

/**
 * @openapi
 * /inspecciones/{id}:
 *   delete:
 *     summary: Eliminar una inspección por ID
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Inspeccion
 *     description: Elimina la inspección correspondiente al ID proporcionado.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la inspección a eliminar.
 *
 *     responses:
 *       '200':
 *         description: Inspección eliminada exitosamente.
 *       '404':
 *         description: No se encontró una inspección asociada a ese ID.
 *       '500':
 *         description: Error interno del servidor.
 */

router.delete('/:id', deleteInspeccionHandler);

export default router;
