import { Router } from 'express';
import {
getAllTecnicosHandler,
getListaTecnicosHandler,
createTecnicoHandler,
updateTecnicoHandler,
deleteTecnicoHandler
} from '../controllers/tecnico/tecnico.controller';
import {
    validateBody,
    validateParams
} from '../middleware/validate.middleware'
import {
    createTecnicoSchema,
    updateTecnicoSchema,
    urlParamsTecnicoSchema
} from '../validations/tecnicSchema'
import { autorizationMiddleware } from '../middleware/autorization.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tecnicos
 *   description: Endpoints para la gestión de técnicos
 */

/**
 * @swagger
 * /tecnicos:
 *   get:
 *     summary: Obtener todos los técnicos
 *     tags: [Tecnicos]
 *     responses:
 *       200:
 *         description: Lista de técnicos obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
//Get all Tecnicos
router.get('/', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), getAllTecnicosHandler);

/**
 * @swagger
 * /tecnicos/lista:
 *   get:
 *     summary: Obtener lista simplificada de técnicos
 *     tags: [Tecnicos]
 *     responses:
 *       200:
 *         description: Lista de técnicos obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
//Get lista de Tecnicos
router.get('/lista', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), getListaTecnicosHandler);

/**
 * @swagger
 * /tecnicos:
 *   post:
 *     summary: Crear un nuevo técnico
 *     tags: [Tecnicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - idGT
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Pedro Perez"
 *               correo:
 *                 type: string
 *                 example: "pedro.perez@example.com"
 *               idGT:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Técnico creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
//Post Tecnico
router.post('/', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), validateBody(createTecnicoSchema), createTecnicoHandler);

/**
 * @swagger
 * /tecnicos/{id}:
 *   patch:
 *     summary: Actualizar un técnico existente
 *     tags: [Tecnicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del técnico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Pedro Perez"
 *               correo:
 *                 type: string
 *                 example: "pedro.perez@example.com"
 *               idGT:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Técnico actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Técnico no encontrado
 *       500:
 *         description: Error interno del servidor
 */
//Patch Tecnico
router.patch('/:id', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), validateParams(urlParamsTecnicoSchema), validateBody(updateTecnicoSchema), updateTecnicoHandler);

/**
 * @swagger
 * /tecnicos/{id}:
 *   delete:
 *     summary: Eliminar un técnico
 *     tags: [Tecnicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del técnico
 *     responses:
 *       200:
 *         description: Técnico eliminado exitosamente
 *       404:
 *         description: Técnico no encontrado
 *       500:
 *         description: Error interno del servidor
 */
//Delete Tecnico
router.delete('/:id', autorizationMiddleware(['DIRECTOR', 'COORDINADOR', 'SUPERVISOR']), validateParams(urlParamsTecnicoSchema), deleteTecnicoHandler);

export default router;