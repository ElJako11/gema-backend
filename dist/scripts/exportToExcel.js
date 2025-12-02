"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.exportUbicacionesToExcel = void 0;
const ExcelJS = __importStar(require("exceljs"));
const ubicacionesTecnicas_service_1 = require("../services/ubicacionesTecnicas/ubicacionesTecnicas.service");
function flattenHierarchy(nodes, path = []) {
    var _a, _b;
    let flatList = [];
    for (const node of nodes) {
        const newPath = [...path, (_a = node.abreviacion) !== null && _a !== void 0 ? _a : ''];
        flatList.push({
            path: newPath,
            descripcion: (_b = node.descripcion) !== null && _b !== void 0 ? _b : '',
        });
        if (node.children && node.children.length > 0) {
            flatList = flatList.concat(flattenHierarchy(node.children, newPath));
        }
    }
    return flatList;
}
const exportUbicacionesToExcel = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicacionesTree = yield (0, ubicacionesTecnicas_service_1.getUbicacionesTecnicas)();
        const flatUbicaciones = flattenHierarchy(ubicacionesTree);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Ubicaciones Técnicas');
        // Determinar el número máximo de niveles
        const maxLevel = Math.max(...flatUbicaciones.map(u => u.path.length), 0);
        // Crear las cabeceras
        const headers = [];
        for (let i = 1; i <= maxLevel; i++) {
            headers.push(`Nivel ${i}`);
        }
        headers.push('Descripción');
        worksheet.columns = headers.map(header => ({ header, key: header }));
        // Añadir las filas
        for (const ubicacion of flatUbicaciones) {
            const row = {};
            for (let i = 0; i < maxLevel; i++) {
                row[`Nivel ${i + 1}`] = ubicacion.path[i] || '';
            }
            row['Descripción'] = ubicacion.descripcion;
            worksheet.addRow(row);
        }
        const buffer = yield workbook.xlsx.writeBuffer();
        return buffer;
    }
    catch (error) {
        console.error('Error exporting to Excel:', error);
        throw new Error('Error al exportar a Excel');
    }
});
exports.exportUbicacionesToExcel = exportUbicacionesToExcel;
