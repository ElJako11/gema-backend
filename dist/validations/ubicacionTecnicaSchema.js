"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ubicacionTecnicaSchema = void 0;
const zod_1 = require("zod");
exports.ubicacionTecnicaSchema = zod_1.z.object({
    descripcion: zod_1.z
        .string()
        .min(1, "La descripción no puede estar vacía")
        .max(50, "La descripción debe tener como máximo 50 caracteres"),
    abreviacion: zod_1.z
        .string()
        .min(1, "La abreviación no puede estar vacía")
        .max(5, "La abreviación debe tener como máximo 5 caracteres"),
    padres: zod_1.z
        .array(zod_1.z.object({
        idPadre: zod_1.z
            .number()
            .refine((val) => val !== undefined, {
            message: "El idPadre es requerido",
        }),
        esUbicacionFisica: zod_1.z.boolean().optional(),
    }))
        .optional(),
});
