"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.validateQuery = exports.validateParams = exports.validateBody = void 0;
const zod_1 = require("zod");
/**
 * Validate request body with a Zod schema
 */
const validateBody = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path.join('.'), // El campo que falló (ej. 'email' o 'padres.0.idPadre')
                message: issue.message, // El mensaje de error (ej. 'Formato de correo inválido')
            }));
            res.status(400).json({
                error: 'Error de validación de datos',
                details: errorMessages,
            });
            return;
        }
        // 4. Si es otro tipo de error (no Zod), pásalo al manejador de errores de Express
        next(error);
    }
};
exports.validateBody = validateBody;
/**
 * Validate route params (req.params) with a Zod schema
 */
const validateParams = (schema) => (req, res, next) => {
    try {
        schema.parse(req.params);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));
            res.status(400).json({
                error: 'Error de validación de parámetros',
                details: errorMessages,
            });
            return;
        }
        next(error);
    }
};
exports.validateParams = validateParams;
/**
 * Validate query string (req.query) with a Zod schema
 */
const validateQuery = (schema) => (req, res, next) => {
    try {
        schema.parse(req.query);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));
            res.status(400).json({
                error: 'Error de validación en query',
                details: errorMessages,
            });
            return;
        }
        next(error);
    }
};
exports.validateQuery = validateQuery;
// Backwards compatibility: default validate = validateBody
exports.validate = exports.validateBody;
