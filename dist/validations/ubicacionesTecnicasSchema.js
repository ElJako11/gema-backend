"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ramasQuerySchema = exports.nivelParamSchema = exports.idHijoParamSchema = exports.idParamSchema = exports.updateUbicacionSchema = exports.createUbicacionSchema = exports.padreSchema = void 0;
const zod_1 = require("zod");
exports.padreSchema = zod_1.z.object({
    idPadre: zod_1.z.coerce.number().int().min(1, 'idPadre inválido'),
    esUbicacionFisica: zod_1.z.boolean().optional(),
    estaHabilitado: zod_1.z.boolean().optional(),
});
exports.createUbicacionSchema = zod_1.z.object({
    descripcion: zod_1.z.string().min(1, 'La descripción es requerida'),
    abreviacion: zod_1.z.string().min(1, 'La abreviación es requerida'),
    padres: zod_1.z.array(exports.padreSchema).optional(),
});
exports.updateUbicacionSchema = zod_1.z.object({
    descripcion: zod_1.z.string().min(1, 'La descripción es requerida').optional(),
    abreviacion: zod_1.z.string().min(1, 'La abreviación es requerida').optional(),
    padres: zod_1.z.array(exports.padreSchema).optional(),
    estaHabilitado: zod_1.z.boolean().optional(),
});
exports.idParamSchema = zod_1.z.object({ id: zod_1.z.coerce.number().int().min(1, 'ID inválido') });
exports.idHijoParamSchema = zod_1.z.object({ idHijo: zod_1.z.coerce.number().int().min(1, 'ID inválido') });
exports.nivelParamSchema = zod_1.z.object({ nivel: zod_1.z.coerce.number().int().min(0, 'Nivel inválido') });
exports.ramasQuerySchema = zod_1.z.object({ nivel: zod_1.z.coerce.number().int().min(0).optional() });
