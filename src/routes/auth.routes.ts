import { Router } from 'express';
import {
  loginHandler,
  registerHandler,
} from '../controllers/auth/auth.controller';
import { validateBody } from '../middleware/validate.middleware';
import { loginSchema } from '../validations/loginSchema';

const router = Router();
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y obtiene un token JWT
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Correo: 
 *                 type: string
 *                 example: coordinador@ucab.edu.ve
 *               Contraseña:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Token JWT generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', validateBody(loginSchema), loginHandler);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Correo:
 *                 type: string
 *                 example: usuario@ucab.edu.ve
 *               Contraseña:
 *                 type: string
 *                 example: 123456
 *               Nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               Tipo:
 *                 type: string
 *                 example: SUPERVISOR
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 correo:
 *                   type: string
 *       400:
 *         description: Error en el registro del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al registrar el usuario
 */

router.post('/register', registerHandler);

export default router;
