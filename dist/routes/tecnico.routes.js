"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tecnico_controller_1 = require("../controllers/tecnico/tecnico.controller");
const tecnico_schema_1 = require("../validations/tecnico.schema");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /tecnicos:
 *   post:
 *     summary: Crea un nuevo técnico
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Técnicos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Nombre
 *               - Correo
 *             properties:
 *               Nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               Correo:
 *                 type: string
 *                 example: juan.perez@email.com
 *     responses:
 *       201:
 *         description: Técnico creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     userId:
 *                       type: integer
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al crear el técnico
 */
router.post('/', (0, validate_middleware_1.validateBody)(tecnico_schema_1.createTecnicoSchema), tecnico_controller_1.createTecnicoHandler);
/**
 * @openapi
 * /tecnicos:
 *   get:
 *     summary: Obtiene todos los técnicos
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Técnicos
 *     responses:
 *       200:
 *         description: Lista de técnicos
 */
/**
 * Handler para obtener todos los técnicos.
 * @param req Express request
 * @param res Express response
 */
router.get('/', tecnico_controller_1.getAllTecnicosHandler);
exports.default = router;
