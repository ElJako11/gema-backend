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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = exports.AuthError = void 0;
const db_1 = require("../../config/db");
const usuarios_1 = require("../../tables/usuarios");
const password_1 = require("../../utils/password");
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthError';
    }
}
exports.AuthError = AuthError;
const login = (_a) => __awaiter(void 0, [_a], void 0, function* ({ Correo, Contraseña }) {
    try {
        // Validate input
        if (!Correo || !Contraseña) {
            throw new AuthError('Correo y Contraseña son campos obligatorios');
        }
        // Buscar usuario y coordinador relacionados
        const result = yield db_1.db
            .select()
            .from(usuarios_1.usuarios)
            .where((0, drizzle_orm_1.eq)(usuarios_1.usuarios.Correo, Correo));
        if (result.length === 0) {
            throw new AuthError('El usuario no existe');
        }
        const Usuarios = result[0];
        if (!(Usuarios === null || Usuarios === void 0 ? void 0 : Usuarios.Contraseña)) {
            throw new AuthError('El usuario no tiene contraseña asignada');
        }
        const isPasswordValid = yield (0, password_1.comparePassword)(Contraseña, Usuarios.Contraseña);
        if (!isPasswordValid) {
            throw new AuthError('Contraseña incorrecta');
        }
        // Genera el token
        const token = jsonwebtoken_1.default.sign({ userId: Usuarios.Id, tipo: Usuarios === null || Usuarios === void 0 ? void 0 : Usuarios.Tipo }, process.env.JWT_SECRET, { expiresIn: '15d' });
        // Excluye la contraseña del usuario antes de devolverlo
        const { Contraseña: _ } = Usuarios, usuarioSinContraseña = __rest(Usuarios, ["Contrase\u00F1a"]);
        return { token, usuario: usuarioSinContraseña };
    }
    catch (error) {
        if (error instanceof AuthError)
            throw error;
        console.error('Error autenticando usuario:', error);
        throw new Error('Error al autenticar usuario');
    }
});
exports.login = login;
// ----------------------------------------------------------
// ----------------------- REGISTRO --------------------------
// ----------------------------------------------------------
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Correo, Contraseña } = data, restoCampos = __rest(data, ["Correo", "Contrase\u00F1a"]);
        // Validaciones básicas
        if (!Correo || !Contraseña) {
            throw new AuthError('Correo y Contraseña son campos obligatorios');
        }
        // Verificar si ya existe un usuario con ese correo
        const existe = yield db_1.db
            .select()
            .from(usuarios_1.usuarios)
            .where((0, drizzle_orm_1.eq)(usuarios_1.usuarios.Correo, Correo));
        if (existe.length > 0) {
            throw new AuthError('Ya existe un usuario con ese correo');
        }
        // Hashear contraseña
        const hashedPassword = yield (0, password_1.hashPassword)(Contraseña);
        // Crear usuario en DB
        const insertResult = yield db_1.db
            .insert(usuarios_1.usuarios)
            .values(Object.assign({ Correo, Contraseña: hashedPassword }, restoCampos))
            .returning();
        const nuevoUsuario = insertResult[0];
        // Generar token igual que login
        const token = jsonwebtoken_1.default.sign({ userId: nuevoUsuario.Id, tipo: nuevoUsuario === null || nuevoUsuario === void 0 ? void 0 : nuevoUsuario.Tipo }, process.env.JWT_SECRET, { expiresIn: '15d' });
        // Excluir contraseña antes de devolver
        const { Contraseña: _ } = nuevoUsuario, usuarioSinContraseña = __rest(nuevoUsuario, ["Contrase\u00F1a"]);
        return { token, usuario: usuarioSinContraseña };
    }
    catch (error) {
        if (error instanceof AuthError)
            throw error;
        console.error('Error registrando usuario:', error);
        throw new Error('Error al registrar usuario');
    }
});
exports.register = register;
