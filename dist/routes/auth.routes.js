"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth/auth.controller");
const validate_middleware_1 = require("../middleware/validate.middleware");
const loginSchema_1 = require("../validations/loginSchema");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /login:
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
 *               Contraseña:
 *                 type: string
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
router.post('/login', (0, validate_middleware_1.validateBody)(loginSchema_1.loginSchema), auth_controller_1.loginHandler);
router.post('/register', auth_controller_1.registerHandler);
exports.default = router;
