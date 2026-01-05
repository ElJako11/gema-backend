import { Router } from 'express';
import { createTrabajoFacadeHandler } from '../controllers/facades/trabajoFacade.controller';
import { validateBody } from '../middleware/validate.middleware';
import { createWorkSchema } from '../validations/workCreationSchema';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Trabajos Facade
 *   description: Endpoints para la creación y gestión de trabajos
 */

/**
 * @swagger
 * /trabajos:
 *   post:
 *     summary: Crear un nuevo trabajo de grado
 *     tags: [Trabajos Facade]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Sistema de Gestión Académica"
 *               modalidad:
 *                 type: string
 *                 example: "INSTRUMENTAL"
 *     responses:
 *       201:
 *         description: Trabajo creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), validateBody(createWorkSchema), createTrabajoFacadeHandler);

export default router;