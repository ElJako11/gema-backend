import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  deleteChecklistHandler,
  getChecklistHandler,
  getChecklistByIDHandler,
  createChecklistHandler,
  updateChecklistHandler,
} from '../controllers/checklist/checklist.controller';
import { autorizationMiddleware } from '../middleware/autorization.middleware'; 
import * as middleware from '../middleware/validate.middleware'
import * as validators from '../validations/checklistSchema';

const router = Router();

/**
 * @openapi
 * /checklists:
 *   get:
 *     summary: Obtiene la lista de checklists.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Checklist
 *     responses:
 *       200:
 *         description: Lista de checklists obtenida correctamente.
 *       500:
 *         description: Error al obtener checklists.
 */
router.get('/', authenticate, autorizationMiddleware(), getChecklistHandler);

/**
 * @openapi
 * /checklists: 
 *   post:
 *     summary: Crea un nuevo checklist.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Checklist
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
 *     responses:
 *       201:
 *         description: Checklist creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                    message:
 *                      type: string
 *                   checklistId:
 *                     type: integer
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error al crear el checklist.
 * 
 * 
*/
router.post('/', authenticate, autorizationMiddleware(), createChecklistHandler);

/**
 * @openapi
 * /checklists/{id}:
 *   put:
 *     summary: Actualiza un checklist existente.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Checklist
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

router.put('/:id', authenticate, autorizationMiddleware(), updateChecklistHandler);

/**
 * @openapi
 * /checklists/{id}:
 *   delete:
 *     summary: Elimina un checklist existente.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Checklist
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
  autorizationMiddleware(),
  middleware.validateParams(validators.urlParamsSchema),
  deleteChecklistHandler,
);

export default router;
