"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTecnicos = exports.createTecnico = void 0;
const db_1 = require("../../config/db");
const usuarios_1 = require("../../tables/usuarios");
const drizzle_orm_1 = require("drizzle-orm");
const createTecnico = (_a) => __awaiter(void 0, [_a], void 0, function* ({ Nombre, Correo, }) {
    try {
        // Validate input
        if (!Nombre || !Correo) {
            throw new Error('Nombre y Correo son campos obligatorios');
        }
        // Insert into usuarios table
        const insertedUser = yield db_1.db
            .insert(usuarios_1.usuarios)
            .values({
            Nombre,
            Correo,
            Tipo: 'SUPERVISOR',
        })
            .returning({ Id: usuarios_1.usuarios.Id });
        if (insertedUser.length === 0) {
            throw new Error('Error al crear el usuario');
        }
        return {
            message: 'Usuario creado correctamente',
            userId: insertedUser[0].Id,
        };
    }
    catch (error) {
        console.error('Error creating tecnico:', error);
        throw new Error('Error al crear el tecnico');
    }
});
exports.createTecnico = createTecnico;
const getAllTecnicos = () => __awaiter(void 0, void 0, void 0, function* () {
    const tecnicos = yield db_1.db
        .select({
        Id: usuarios_1.usuarios.Id,
        Nombre: usuarios_1.usuarios.Nombre,
        Correo: usuarios_1.usuarios.Correo,
    })
        .from(usuarios_1.usuarios)
        .where((0, drizzle_orm_1.eq)(usuarios_1.usuarios.Tipo, 'SUPERVISOR'));
    return tecnicos;
});
exports.getAllTecnicos = getAllTecnicos;
