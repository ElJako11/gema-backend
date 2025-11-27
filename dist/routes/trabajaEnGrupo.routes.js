"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trabajaEnGrupo_controller_1 = require("../controllers/trabajaEnGrupo/trabajaEnGrupo.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const trabajaEnGrupo_Schema_1 = require("../validations/trabajaEnGrupo.Schema");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /trabajaEnGrupo:
 *   post:
 *     summary: Asigna un técnico a un grupo de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TrabajaEnGrupo
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
 *       500:
 *         description: Error al asignar trabajador al grupo
 */
router.post('/', (0, validate_middleware_1.validateBody)(trabajaEnGrupo_Schema_1.createTrabajaEnGrupoSchema), trabajaEnGrupo_controller_1.createTrabajaEnGrupoHandler);
/**
 * @openapi
 * /trabajaEnGrupo:
 *   get:
 *     summary: Obtiene todos los trabajadores agrupados por grupo de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TrabajaEnGrupo
 *     responses:
 *       200:
 *         description: Lista de grupos con sus trabajadores
 */
router.get('/', trabajaEnGrupo_controller_1.getAllTrabajaEnTodosLosGruposHandler);
/**
 * @openapi
 * /trabajaEnGrupo/{grupoDeTrabajoId}:
 *   get:
 *     summary: Obtiene todos los trabajadores de un grupo de trabajo específico
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TrabajaEnGrupo
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
router.get('/:grupoDeTrabajoId', (0, validate_middleware_1.validateParams)(trabajaEnGrupo_Schema_1.paramsTrabajaEnGrupoSchema), trabajaEnGrupo_controller_1.getAllTrabajaEnGrupoHandler);
/**
 * @openapi
 * /trabajaEnGrupo/{tecnicoId}/{grupoDeTrabajoId}:
 *   delete:
 *     summary: Elimina la asignación de un técnico a un grupo de trabajo
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TrabajaEnGrupo
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
router.delete('/:tecnicoId/:grupoDeTrabajoId', (0, validate_middleware_1.validateParams)(trabajaEnGrupo_Schema_1.deleteTrabajaEnGrupoSchema), trabajaEnGrupo_controller_1.deleteTrabajaEnGrupoHandler);
exports.default = router;
