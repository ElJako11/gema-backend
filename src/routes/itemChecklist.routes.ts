import { RequestHandler, Router } from 'express';
import {
  getAllItemsHandler,
  postItemHandler,
  patchItemHandler,
  deleteItemHandler,
  getItemsChecklistHandler,
} from '../controllers/checklistItems/checklistItem.controller';

import { authenticate } from '../middleware/auth.middleware';
import { autorizationMiddleware } from '../middleware/autorization.middleware';

const router = Router();

/**
 * @openapi
 * /item-checklist:
 *  get:
 *    summary: Obtiene todos los items de checklists
 *    tags:
 *      - Items Checklists
 *    responses:
 *        200:
 *          description: Listado de todos los items
 *        500:
 *          description: Error interno del servidor
 */

router.get('/', authenticate, autorizationMiddleware(), getAllItemsHandler);

router.get('/:id', authenticate, autorizationMiddleware(), getItemsChecklistHandler);

/**
 * @openapi
 * /item-checklist:
 *  post:
 *    summary: Permite la creacion de un item.
 *    tags:
 *      - Items Checklists
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - idChecklist
 *              - descripcion
 *              - titulo
 *            properties:
 *              idChecklist:
 *                type: integer
 *                example: 1
 *              descripcion:
 *                type: string
 *                example: Informacion...
 *              titulo:
 *                type: string
 *                example: Verificar la tuberia del aire
 *    responses:
 *      201:
 *       description: Item creado correctamente
 *      400:
 *       description: Datos enviados incorrectamente o no recibidos
 *      500:
 *       description: Error interno del servidor
 */
router.post('/', postItemHandler);

/**
 * @openapi
 * /item-checklist/{idChecklist}/{idItem}:
 *   patch:
 *    summary: Actualiza el item de una checklist por ID
 *    tags:
 *      - Items Checklists
 *    parameters:
 *      - in: path
 *        name: idChecklist
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del checklist
 *      - in: path
 *        name: idItem
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del item de la checklist
 *    requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                descripcion:
 *                  type: string
 *                  example: Detalles del item
 *                titulo:
 *                  type: string
 *                  example: Verificar la tuberia del aire
 *    responses:
 *      200:
 *        description: Item actualizado correctamente
 *      400:
 *        description: Datos invalidos
 *      500:
 *        description: Error interno del servidor
 */
router.patch('/:idchecklist/:iditem', patchItemHandler);

/**
 * @openapi
 * /item-checklist/{id}:
 *  delete:
 *    summary: Elimina un item usando su ID
 *    tags:
 *      - Items Checklists
 *    parameters:
 *      - in: path
 *        name: idItem
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID del item a eliminar
 *    responses:
 *      200:
 *        description: Item eliminado correctamente
 *      400:
 *        description: ID del item invalido
 *      500:
 *        description: Error interno del servidor
 */
router.delete('/', deleteItemHandler);

export default router;
