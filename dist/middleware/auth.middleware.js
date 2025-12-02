"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (authorizedRoles = []) => {
    return (req, res, next) => {
        const token = req.cookies.accessToken;
        if (!token) {
            res
                .status(401)
                .json({ error: 'Token no obtenido. Usuario no autorizado' });
            return;
        }
        // Verifico si el token es valido.
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if (authorizedRoles.length === 0) {
                next();
                return;
            }
            const role = authorizedRoles.find(role => role === decoded.tipo);
            if (role === undefined) {
                res.status(401).json({ error: 'Usuario no autorizado' });
                return;
            }
            next();
            return;
        }
        catch (error) {
            res.status(401).json({ message: 'Inicia Sesión' });
            return;
        }
    };
};
exports.authenticate = authenticate;
