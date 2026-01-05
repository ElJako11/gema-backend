import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  deleteChecklistHandler,
  getChecklistHandler,
  getChecklistWithItemsHandler,
  postChecklistHandler,
  putChecklistHandler,
} from '../controllers/checklist/checklist.controller';
import { autorizationMiddleware } from '../middleware/autorization.middleware';
import {
  validateBody,
  validateParams,
} from '../middleware/validate.middleware';
import {
  checklistIdParamSchema,
  createChecklistSchema,
  updateChecklistSchema,
} from '../validations/checklist.schema';


const router = Router();

/**
 * @swagger
 * /checklists:
 *   get:
 *     summary: Obtiene la lista de checklists.
 *     security:
 *       - bearerAuth: []
 *     tags: [Checklist]
 *     responses:
 *       200:
 *         description: Lista de checklists obtenida correctamente.
 *       500:
 *         description: Error al obtener checklists.
 */
router.get('/', authenticate, autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), getChecklistHandler);

/**
 * @swagger
 * /checklists:
 *   post:
 *     summary: Crea un nuevo checklist.
 *     security:
 *       - bearerAuth: []
 *     tags: [Checklist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Checklist de seguridad
 *               descripcion:
 *                 type: string
 *                 example: "Descripción detallada del checklist de seguridad."
 *     responses:
 *       201:
 *         description: Checklist creado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error al crear el checklist.
 */
router.post(
  '/',
  authenticate,
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']),
  validateBody(createChecklistSchema),
  postChecklistHandler
);

/**
 * @swagger
 * /checklists/{id}:
 *   get:
 *     summary: Obtiene un checklist con sus items por ID.
 *     security:
 *       - bearerAuth: []
 *     tags: [Checklist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del checklist a obtener.
 *     responses:
 *       200:
 *         description: Checklist obtenido correctamente.
 *       404:
 *         description: Checklist no encontrado.
 *       500:
 *         description: Error al obtener el checklist.
 */
router.get(
  '/:id',
  authenticate,
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']),
  validateParams(checklistIdParamSchema),
  getChecklistWithItemsHandler
);

/**
 * @swagger
 * /checklists/{id}:
 *   put:
 *     summary: Actualiza un checklist existente.
 *     security:
 *       - bearerAuth: []
 *     tags: [Checklist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del checklist a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Checklist de seguridad actualizado
 *               descripcion:
 *                 type: string
 *                 example: "Descripción actualizada del checklist."
 *     responses:
 *       200:
 *         description: Checklist actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Checklist no encontrado.
 *       500:
 *         description: Error al actualizar el checklist.
 */
router.put(
  '/:id',
  authenticate,
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']),
  validateParams(checklistIdParamSchema),
  validateBody(updateChecklistSchema),
  putChecklistHandler
);

/**
 * @swagger
 * /checklists/{id}:
 *   delete:
 *     summary: Elimina un checklist existente.
 *     security:
 *       - bearerAuth: []
 *     tags: [Checklist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del checklist a eliminar.
 *     responses:
 *       200:
 *         description: Checklist eliminado correctamente.
 *       404:
 *         description: Checklist no encontrado.
 *       500:
 *         description: Error al eliminar el checklist.
 */
router.delete(
  '/:id',
  authenticate,
  autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']),
  validateParams(checklistIdParamSchema),
  deleteChecklistHandler
);

export default router;
