"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, "El correo electrónico es requerido") // aquí controlas el requerido
        .email("Correo electrónico inválido")
        .endsWith("ucab.edu.ve", "El correo debe ser de la UCAB"),
    password: zod_1.z
        .string()
        .min(1, "La contraseña es requerida"), // aquí también
});
