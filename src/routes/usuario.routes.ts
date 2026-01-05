import { Router } from "express";
import {
    getUsuariosHandler,
    getUsuarioByIdHandler,
    getUsuarioCredentialsHandler,
    createUsuarioHandler,
    updateUsuarioHandler,
    deleteUsuarioHandler
} from "../controllers/usuario/usuario.controller";
import {
    validateBody,
    validateParams
} from '../middleware/validate.middleware';
import {
    createUserSchema,
    updateUserSchema,
    urlParamsSchema
} from '../validations/usuarioSchema';
import {autorizationMiddleware} from '../middleware/autorization.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
//Get all Usuarios
router.get('/', autorizationMiddleware(['DIRECTOR']), getUsuariosHandler);

/**
 * @swagger
 * /usuarios/list:
 *   get:
 *     summary: Obtener lista de credenciales de usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de credenciales obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
//Get Usuario Credentials
router.get('/list', autorizationMiddleware(['DIRECTOR']), getUsuarioCredentialsHandler);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
//Get Usuario by ID
router.get('/:id', autorizationMiddleware(['DIRECTOR']), validateParams(urlParamsSchema), getUsuarioByIdHandler);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Perez
 *               correo:
 *                 type: string
 *                 example: juan.p@ucab.edu.ve
 *               contraseña:
 *                 type: string
 *                 example: password123
 *               tipo:
 *                 type: string
 *                 enum: [SUPERVISOR, COORDINADOR, DIRECTOR]
 *                 example: COORDINADOR
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error interno del servidor
 */
//Post Usuario
router.post('/', autorizationMiddleware(['DIRECTOR']), validateBody(createUserSchema), createUsuarioHandler);

/**
 * @swagger
 * /usuarios/{id}:
 *   patch:
 *     summary: Actualizar un usuario existente
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apellido:
 *                 type: string
 *                 example: Perez
 *               correo:
 *                 type: string
 *                 example: juan.pe@ucab.edu.ve
 *               tipo:
 *                 type: string
 *                 enum: [SUPERVISOR, COORDINADOR, DIRECTOR]
 *                 example: SUPERVISOR
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
//Patch Usuario
router.patch('/:id', autorizationMiddleware(['DIRECTOR']), validateParams(urlParamsSchema), validateBody(updateUserSchema), updateUsuarioHandler);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
//Delete Usuario
router.delete('/:id', autorizationMiddleware(['DIRECTOR']), validateParams(urlParamsSchema), deleteUsuarioHandler);

export default router;
