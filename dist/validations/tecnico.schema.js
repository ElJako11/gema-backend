"use strict";
// src/schemas/tecnico.schema.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTecnicoSchema = void 0;
const zod_1 = require("zod");
/**
 * Esquema para validar la creación de un nuevo Técnico.
 * Sigue el patrón de usar .min(1) para garantizar que el campo no sea ni faltante ni vacío.
 */
exports.createTecnicoSchema = zod_1.z.object({
    // Validación para el Nombre
    // Asegura que el campo exista y que la cadena no esté vacía.
    Nombre: zod_1.z
        .string()
        .min(1, 'El nombre es obligatorio y no puede estar vacío.')
        .min(2, 'El nombre debe tener al menos 2 caracteres.'), // Regla adicional de longitud
    // Validación para el Correo
    // Asegura que el campo exista, no esté vacío, y sea un formato de email válido.
    Correo: zod_1.z
        .string()
        .min(1, 'El correo electrónico es obligatorio.')
        .email('El formato del correo es inválido.'),
});
