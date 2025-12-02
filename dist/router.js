"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tecnico_routes_1 = __importDefault(require("./routes/tecnico.routes"));
const gruposDeTrabajo_routes_1 = __importDefault(require("./routes/gruposDeTrabajo.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const ubicacionesTecnicas_routes_1 = __importDefault(require("./routes/ubicacionesTecnicas.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware"); // Importa el middleware
const trabajaEnGrupo_routes_1 = __importDefault(require("./routes/trabajaEnGrupo.routes"));
const router = (0, express_1.Router)();
// Protege la ruta de tecnicos
router.use('/tecnicos', (0, auth_middleware_1.authenticate)([]), tecnico_routes_1.default);
router.use('/grupos', (0, auth_middleware_1.authenticate)([]), gruposDeTrabajo_routes_1.default);
router.use('/trabajaEnGrupo', (0, auth_middleware_1.authenticate)([]), trabajaEnGrupo_routes_1.default);
router.use('/auth', auth_routes_1.default);
router.use('/ubicaciones-tecnicas', (0, auth_middleware_1.authenticate)([]), ubicacionesTecnicas_routes_1.default);
exports.default = router;
