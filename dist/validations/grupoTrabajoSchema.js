"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grupoTrabajoSchema = void 0;
const zod_1 = require("zod");
exports.grupoTrabajoSchema = zod_1.z.object({
    codigo: zod_1.z
        .string()
        .min(1, "El código es requerido") // asegura que no esté vacío
        .min(3, "El código debe tener al menos 3 caracteres"),
    nombre: zod_1.z
        .string()
        .min(1, "El nombre es requerido"), // asegura que no esté vacío
    supervisorId: zod_1.z.coerce
        .number()
        .int()
        .refine((val) => val !== undefined && val !== null, {
        message: 'El supervisorId es requerido',
    }),
    area: zod_1.z
        .string()
        .min(1, 'El area es requerida')
        .min(3, 'El area debe tener al menos 3 caracteres'),
});
