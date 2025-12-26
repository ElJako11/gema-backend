import { Router } from 'express';
import {
  createTrabajaEnGrupoHandler,
  deleteTrabajaEnGrupoHandler,
  getAllTrabajaEnGrupoHandler,
  getAllTrabajaEnTodosLosGruposHandler,
} from '../controllers/trabajaEnGrupo/trabajaEnGrupo.controller';
import { validateBody, validateParams } from '../middleware/validate.middleware';
import { createTrabajaEnGrupoSchema, deleteTrabajaEnGrupoSchema, paramsTrabajaEnGrupoSchema } from '../validations/trabajaEnGrupo.Schema';
import { param } from 'drizzle-orm';

const router = Router();

/**
 * @openapi
 * /trabajaEnGrupo:
 *   post:
 *     summary: Asigna un técnico a un grupo de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabaja En Grupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tecnicoId
 *               - grupoDeTrabajoId
 *             properties:
 *               tecnicoId:
 *                 type: integer
 *                 example: 1
 *               grupoDeTrabajoId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Trabajador asignado correctamente al grupo
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Tecnico o grupo de trabajo no encontrado
 *       500:
 *         description: Error al asignar trabajador al grupo
 */
router.post('/', validateBody(createTrabajaEnGrupoSchema), createTrabajaEnGrupoHandler);

/**
 * @openapi
 * /trabajaEnGrupo:
 *   get:
 *     summary: Obtiene todos los trabajadores agrupados por grupo de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabaja En Grupo
 *     responses:
 *       200:
 *         description: Lista de grupos con sus trabajadores
 */
router.get('/', getAllTrabajaEnTodosLosGruposHandler);

/**
 * @openapi
 * /trabajaEnGrupo/{grupoDeTrabajoId}:
 *   get:
 *     summary: Obtiene todos los trabajadores de un grupo de trabajo específico
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabaja En Grupo
 *     parameters:
 *       - in: path
 *         name: grupoDeTrabajoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo de trabajo
 *     responses:
 *       200:
 *         description: Lista de trabajadores del grupo
 *       404:
 *         description: Grupo de trabajo no encontrado
 */
router.get('/:grupoDeTrabajoId', validateParams(paramsTrabajaEnGrupoSchema), getAllTrabajaEnGrupoHandler);

/**
 * @openapi
 * /trabajaEnGrupo/{tecnicoId}/{grupoDeTrabajoId}:
 *   delete:
 *     summary: Elimina la asignación de un técnico a un grupo de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Trabaja En Grupo
 *     parameters:
 *       - in: path
 *         name: tecnicoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del técnico
 *       - in: path
 *         name: grupoDeTrabajoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo de trabajo
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al eliminar la asignación
 */
router.delete('/:tecnicoId/:grupoDeTrabajoId', validateParams(deleteTrabajaEnGrupoSchema), deleteTrabajaEnGrupoHandler);
export default router;
