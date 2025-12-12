import { Router } from 'express';
import {
  createUbicacionTecnicaHandler,
  updateUbicacionTecnicaHandler,
  deleteUbicacionTecnicaHandler,
  getUbicacionesTecnicasHandler,
  getUbicacionTecnicaByIdHandler,
  getUbicacionesDependientesHandler,
  getUbicacionesPorNivelHandler,
  getPadresByIdHijoHandler,
  exportUbicacionesToExcelHandler,
} from '../controllers/ubicacionesTecnicas/ubicacionesTecnicas.controller';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.middleware';
import {
  createUbicacionSchema,
  updateUbicacionSchema,
  idParamSchema,
  idHijoParamSchema,
  nivelParamSchema,
  ramasQuerySchema,
} from '../validations/ubicacionesTecnicasSchema';

const router = Router();

/**
 * @openapi
 * /ubicaciones-tecnicas/export/excel:
 *   get:
 *     summary: Exporta todas las ubicaciones técnicas a un archivo Excel
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - UbicacionesTecnicas
 *     responses:
 *       200:
 *         description: Archivo Excel generado correctamente
 */
router.get('/export/excel', exportUbicacionesToExcelHandler);

/**
 * @openapi
 * /ubicaciones-tecnicas/ramas/{id}:
 *   get:
 *     summary: Obtiene las ubicaciones técnicas dependientes de una ubicación padre
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - UbicacionesTecnicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ubicación técnica padre
 *     responses:
 *       200:
 *         description: Lista de ubicaciones técnicas dependientes
 *       404:
 *         description: Ubicación técnica no encontrada
 */
router.get('/ramas/:id', validateParams(idParamSchema), validateQuery(ramasQuerySchema), getUbicacionesDependientesHandler);

/**
 * @openapi
 * /ubicaciones-tecnicas/nivel/{nivel}:
 *   get:
 *     summary: Obtiene las ubicaciones técnicas por nivel
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - UbicacionesTecnicas
 *     parameters:
 *       - in: path
 *         name: nivel
 *         required: true
 *         schema:
 *           type: integer
 *         description: Nivel de la ubicación técnica
 *     responses:
 *       200:
 *         description: Lista de ubicaciones técnicas por nivel
 */
router.get('/nivel/:nivel', validateParams(nivelParamSchema), getUbicacionesPorNivelHandler); // GET /ubicaciones-tecnicas/nivel/:nivel

/**
 * @openapi
 * /ubicaciones-tecnicas:
 *   get:
 *     summary: Obtiene todas las ubicaciones técnicas
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - UbicacionesTecnicas
 *     responses:
 *       200:
 *         description: Lista de ubicaciones técnicas
 */
router.get('/', getUbicacionesTecnicasHandler);

/**
 * @openapi
 * /ubicaciones-tecnicas/{id}:
 *   get:
 *     summary: Obtiene una ubicación técnica por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - UbicacionesTecnicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ubicación técnica
 *     responses:
 *       200:
 *         description: Ubicación técnica encontrada
 *       404:
 *         description: Ubicación técnica no encontrada
 */
router.get('/:id', validateParams(idParamSchema), getUbicacionTecnicaByIdHandler);

/**
 * @openapi
 * /ubicaciones-tecnicas:
 *   post:
 *     summary: Crea una nueva ubicación técnica
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - UbicacionesTecnicas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Descripción de la ubicación A"
 *               abreviacion:
 *                 type: string
 *                 description: Abreviación única de la ubicación técnica
 *                 example: "UB1"
 *               codigo_Identificacion:
 *                 type: string
 *                 description: Código de identificación de la ubicación técnica 
 *                 example: "COD123"
 *               padres:
 *                 type: array
 *                 description: Lista de padres de la ubicación técnica
 *                 items:
 *                   type: object
 *                   properties:
 *                     idPadre:
 *                       type: integer
 *                       example: 1
 *                     esUbicacionFisica:
 *                       type: boolean
 *                       example: true
 *                   description: Lista de padres de la ubicación técnica
 *     responses:
 *       201:
 *         description: Ubicación técnica creada correctamente
 *       400:
 *        description: Datos inválidos
 *       409:
 *         description: Ya existe una ubicación técnica con esta abreviación
 *       500:
 *         description: Error al crear la ubicación técnica
 */
router.post('/', validateBody(createUbicacionSchema), createUbicacionTecnicaHandler);

/**
 * @openapi
 * /ubicaciones-tecnicas/{id}:
 *   put:
 *     summary: Actualiza una ubicación técnica por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - UbicacionesTecnicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ubicación técnica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Nueva descripción de la ubicación A"
 *               abreviacion:
 *                 type: string
 *                 example: "NV1"
 *               padres:
 *                 type: array
 *                 description: Lista de padres de la ubicación técnica
 *                 items:
 *                   type: object
 *                   properties:
 *                     idPadre:
 *                       type: integer
 *                       example: 1
 *                     esUbicacionFisica:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       200:
 *         description: Ubicación técnica actualizada correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Ubicación técnica no encontrada
 *       500:
 *         description: Error al actualizar la ubicación técnica
 */
router.put('/:id', validateParams(idParamSchema), validateBody(updateUbicacionSchema), updateUbicacionTecnicaHandler);

/**
 * @openapi
 * /ubicaciones-tecnicas/{id}:
 *   delete:
 *     summary: Elimina una ubicación técnica por ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - UbicacionesTecnicas
 *     parameters:
 *       - in: path
 *         name: id
 *         example: 4
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ubicación técnica
 *     responses:
 *       200:
 *         description: Ubicación técnica eliminada correctamente
 *       404:
 *         description: Ubicación técnica no encontrada
 *       500:
 *         description: Error al eliminar la ubicación técnica
 */
router.delete('/:id', validateParams(idParamSchema), deleteUbicacionTecnicaHandler);

/**
 * @openapi
 * /ubicaciones-tecnicas/padres/{idHijo}:
 *   get:
 *     summary: Obtiene la cadena de padres de una ubicación técnica
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - UbicacionesTecnicas
 *     parameters:
 *       - in: path
 *         name: idHijo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ubicación técnica hija
 *     responses:
 *       200:
 *         description: Lista de padres de la ubicación técnica
 *       404:
 *         description: Ubicación técnica no encontrada
 */
router.get('/padres/:idHijo', validateParams(idHijoParamSchema), getPadresByIdHijoHandler); // GET /ubicaciones-tecnicas/padres/:idHijo

export default router;
