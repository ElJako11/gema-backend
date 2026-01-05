import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  deletePlantillaHandler,
  getPlantillaHandler,
  getPlantillaWithItemsHandler,
  postPlantillaHandler,
  putPlantillaHandler,
} from '../controllers/plantilla/plantilla.controller';
import { autorizationMiddleware } from '../middleware/autorization.middleware';
import { validateBody, validateParams } from '../middleware/validate.middleware';
import { createPlantillaSchema, plantillaIdParamSchema, updatePlantillaSchema } from '../validations/plantillaSchema';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Plantillas
 *   description: Endpoints para la gestión de plantillas de checklist
 */

/**
 * @swagger
 * /plantillas:
 *   get:
 *     summary: Obtener todas las plantillas
 *     tags: [Plantillas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de plantillas obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', authenticate, autorizationMiddleware(['DIRECTOR', 'COORDINADOR']), getPlantillaHandler);

/**
 * @swagger
 * /plantillas/{id}:
 *   get:
 *     summary: Obtener una plantilla con sus items por ID
 *     tags: [Plantillas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la plantilla
 *     responses:
 *       200:
 *         description: Plantilla encontrada
 *       404:
 *         description: Plantilla no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/:id',
  authenticate,
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR']),
  validateParams(plantillaIdParamSchema),
  getPlantillaWithItemsHandler
);

/**
 * @swagger
 * /plantillas:
 *   post:
 *     summary: Crear una nueva plantilla
 *     tags: [Plantillas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Plantilla de Inspección Eléctrica"
 *               descripcion:
 *                 type: string
 *                 example: "Checklist para la revisión de componentes eléctricos."
 *     responses:
 *       201:
 *         description: Plantilla creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/', 
  authenticate, 
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR']), 
  validateBody(createPlantillaSchema), 
  postPlantillaHandler
);

/**
 * @swagger
 * /plantillas/{id}:
 *   put:
 *     summary: Actualizar una plantilla existente
 *     tags: [Plantillas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la plantilla
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Plantilla de Inspección Mecánica"
 *               descripcion:
 *                 type: string
 *                 example: "Checklist actualizado para componentes mecánicos."
 *     responses:
 *       200:
 *         description: Plantilla actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Plantilla no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put(
  '/:id', 
  authenticate, 
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR']), 
  validateParams(plantillaIdParamSchema), 
  validateBody(updatePlantillaSchema), 
  putPlantillaHandler
);

/**
 * @swagger
 * /plantillas/{id}:
 *   delete:
 *     summary: Eliminar una plantilla
 *     tags: [Plantillas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la plantilla
 *     responses:
 *       200:
 *         description: Plantilla eliminada exitosamente
 *       404:
 *         description: Plantilla no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
  '/:id',
  authenticate,
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR']),
  validateParams(plantillaIdParamSchema),
  deletePlantillaHandler
);

export default router;
