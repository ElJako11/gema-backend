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
router.post('/register', registerHandler);

export default router;
