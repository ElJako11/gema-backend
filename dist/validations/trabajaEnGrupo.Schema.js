"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrabajaEnGrupoSchema = exports.paramsTrabajaEnGrupoSchema = exports.createTrabajaEnGrupoSchema = void 0;
const zod_1 = require("zod");
const positiveIntId = zod_1.z
    .number({ error: 'El ID debe ser un número' })
    .int('El ID debe ser un número entero')
    .min(1, 'El ID debe ser un número positivo (mayor que 0)');
exports.createTrabajaEnGrupoSchema = zod_1.z.object({
    tecnicoId: positiveIntId,
    grupoDeTrabajoId: positiveIntId,
});
const positiveIntIdCoercion = zod_1.z.coerce
    .number()
    .pipe(positiveIntId);
exports.paramsTrabajaEnGrupoSchema = zod_1.z.object({
    grupoDeTrabajoId: positiveIntIdCoercion,
});
exports.deleteTrabajaEnGrupoSchema = zod_1.z.object({
    tecnicoId: positiveIntIdCoercion,
    grupoDeTrabajoId: positiveIntIdCoercion,
});
