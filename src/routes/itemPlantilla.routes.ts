import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';
import { validateBody, validateParams } from '../middleware/validate.middleware';
import {
    postItemHandler,
    putItemHandler,
    deleteItemHandler
} from '../controllers/itemPlantilla/itemPlantilla.controller';
import {
    createItemSchema,
    updateItemSchema,
    urlParamsSchema,
    plantillaIdParamSchema
} from '../validations/itemPlantillaSchema';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ItemsPlantilla
 *   description: Endpoints para la gestión de items de plantillas
 */

/**
 * @swagger
 * /item-plantilla:
 *   post:
 *     summary: Crear un nuevo item para una plantilla
 *     tags: [ItemsPlantilla]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPlantilla:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: "Descripción del nuevo item"
 *               titulo:
 *                 type: string
 *                 example: "Título del nuevo item"
 *     responses:
 *       201:
 *         description: Item de plantilla creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post(
    '/',
    authenticate,
    autorizationMiddleware(['DIRECTOR', 'COORDINADOR']),
    validateBody(createItemSchema),
    postItemHandler
);

/**
 * @swagger
 * /item-plantilla/{idItemPlantilla}/plantilla/{idPlantilla}:
 *   put:
 *     summary: Actualizar un item de una plantilla
 *     tags: [ItemsPlantilla]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idItemPlantilla
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del item de la plantilla a actualizar
 *       - in: path
 *         name: idPlantilla
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la plantilla a la que pertenece el item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Descripción actualizada del item"
 *               titulo:
 *                 type: string
 *                 example: "Título actualizado del item"
 *     responses:
 *       200:
 *         description: Item de plantilla actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Item o plantilla no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put(
    '/:idItemPlantilla/plantilla/:idPlantilla',
    authenticate,
    autorizationMiddleware(['DIRECTOR', 'COORDINADOR']),
    validateParams(urlParamsSchema),
    validateBody(updateItemSchema),
    putItemHandler
);

/**
 * @swagger
 * /item-plantilla/{idItemPlantilla}/plantilla/{idPlantilla}:
 *   delete:
 *     summary: Eliminar un item de una plantilla
 *     tags: [ItemsPlantilla]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idItemPlantilla
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del item de la plantilla a eliminar
 *       - in: path
 *         name: idPlantilla
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la plantilla a la que pertenece el item
 *     responses:
 *       200:
 *         description: Item de plantilla eliminado exitosamente
 *       404:
 *         description: Item o plantilla no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete(
    '/:idItemPlantilla/plantilla/:idPlantilla',
    authenticate,
    autorizationMiddleware(['DIRECTOR', 'COORDINADOR']),
    validateParams(urlParamsSchema),
    deleteItemHandler
);

export default router;
