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
exports.getPadresByIdHijoHandler = exports.exportUbicacionesToExcelHandler = exports.getUbicacionesPorNivelHandler = exports.getUbicacionesDependientesHandler = exports.getUbicacionTecnicaByIdHandler = exports.getUbicacionesTecnicasHandler = exports.deleteUbicacionTecnicaHandler = exports.updateUbicacionTecnicaHandler = exports.createUbicacionTecnicaHandler = void 0;
const ubicacionesTecnicas_service_1 = require("../../services/ubicacionesTecnicas/ubicacionesTecnicas.service");
const exportToExcel_1 = require("../../scripts/exportToExcel");
/**
 * Crea una nueva ubicación técnica.
 * Método: POST
 * Endpoint: /ubicaciones-tecnicas
 * Body:
 *   - descripcion: string (requerido)
 *   - abreviacion: string (requerido)
 *   - padres: Array<{ idPadre: number; esUbicacionFisica?: boolean }> (opcional)
 *     - idPadre: ID del padre
 *     - esUbicacionFisica: true si este padre es la ubicación física principal
 *     - estaHabilitado: boolean (opcional, por defecto true)
 * Descripción: Crea una ubicación técnica y la asocia a uno o varios padres.
 * Ejemplo de body para padres:
 *   padres: [
 *     { idPadre: 1, esUbicacionFisica: true },
 *     { idPadre: 2 }
 *   ]
 * Si hay varios padres, solo uno debe tener esUbicacionFisica: true (el resto se asume false).
 */
const createUbicacionTecnicaHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicacion = yield (0, ubicacionesTecnicas_service_1.createUbicacionTecnica)(req.body);
        res.status(201).json({
            data: ubicacion,
        });
        return;
    }
    catch (error) {
        console.error('Error in createUbicacionTecnicaHandler:', error);
        res.status(500).json({
            error: 'Error al crear la ubicación técnica',
        });
        return;
    }
});
exports.createUbicacionTecnicaHandler = createUbicacionTecnicaHandler;
/**
 * Actualiza una ubicación técnica existente.
 * Método: PUT
 * Endpoint: /ubicaciones-tecnicas/:id
 * Params:
 *   - id: number (en la ruta, requerido)
 * Body:
 *   - descripcion: string (opcional)
 *   - abreviacion: string (opcional)
 *   - padres: Array<{ idPadre: number; esUbicacionFisica?: boolean }> (opcional)
 *   - estaHabilitado: boolean (opcional)
 * Descripción: Actualiza los datos de una ubicación técnica. Si se envía el campo padres, se actualizan las relaciones de padres y se recalculan nivel y código de identificación.
 * Ejemplo de body para padres igual que en creación.
 */
const updateUbicacionTecnicaHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUbicacion = Number(req.params.id);
        const ubicacion = yield (0, ubicacionesTecnicas_service_1.updateUbicacionTecnica)(idUbicacion, req.body);
        res.status(200).json({ data: ubicacion });
        return;
    }
    catch (error) {
        console.error('Error in updateUbicacionTecnicaHandler:', error);
        res.status(500).json({ error: 'Error al actualizar la ubicación técnica' });
        return;
    }
});
exports.updateUbicacionTecnicaHandler = updateUbicacionTecnicaHandler;
/**
 * Deshabilita una ubicación técnica y todos sus descendientes recursivamente (soft delete).
 * Método: DELETE
 * Endpoint: /ubicaciones-tecnicas/:id
 * Params:
 *   - id: number (en la ruta, requerido)
 * Descripción: Deshabilita la ubicación técnica y, en cascada, todos los hijos cuya relación apunte a este padre, sin importar si es física o virtual. No se elimina físicamente, solo se pone estaHabilitado=false.
 */
const deleteUbicacionTecnicaHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUbicacion = Number(req.params.id);
        const ubicacion = yield (0, ubicacionesTecnicas_service_1.deleteUbicacionTecnica)(idUbicacion);
        res.status(200).json({ data: ubicacion });
        return;
    }
    catch (error) {
        console.error('Error in deleteUbicacionTecnicaHandler:', error);
        res.status(500).json({ error: 'Error al eliminar la ubicación técnica' });
        return;
    }
});
exports.deleteUbicacionTecnicaHandler = deleteUbicacionTecnicaHandler;
/**
 * Obtiene todas las ubicaciones técnicas habilitadas.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas
 * Descripción: Retorna todas las ubicaciones técnicas registradas en el sistema que están habilitadas.
 */
const getUbicacionesTecnicasHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicaciones = yield (0, ubicacionesTecnicas_service_1.getUbicacionesTecnicas)();
        res.status(200).json({ data: ubicaciones });
        return;
    }
    catch (error) {
        console.error('Error in getUbicacionesTecnicasHandler:', error);
        res
            .status(500)
            .json({ error: 'Error al obtener las ubicaciones técnicas' });
        return;
    }
});
exports.getUbicacionesTecnicasHandler = getUbicacionesTecnicasHandler;
/**
 * Obtiene una ubicación técnica por su ID.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/:id
 * Params:
 *   - id: number (en la ruta, requerido)
 * Descripción: Retorna la ubicación técnica correspondiente al ID, si está habilitada.
 */
const getUbicacionTecnicaByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUbicacion = Number(req.params.id);
        const ubicacion = yield (0, ubicacionesTecnicas_service_1.getUbicacionTecnicaById)(idUbicacion);
        res.status(200).json({ data: ubicacion });
        return;
    }
    catch (error) {
        console.error('Error in getUbicacionTecnicaByIdHandler:', error);
        res.status(404).json({ error: 'Ubicación técnica no encontrada' });
        return;
    }
});
exports.getUbicacionTecnicaByIdHandler = getUbicacionTecnicaByIdHandler;
/**
 * Obtiene todas las ubicaciones dependientes (descendientes) de una ubicación dada.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/ramas/:id
 * Query params:
 *   - nivel: number (opcional)
 * Descripción: Retorna todas las ubicaciones dependientes (descendientes) de la ubicación dada. Si se indica nivel, solo retorna las de ese nivel.
 */
const getUbicacionesDependientesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUbicacion = Number(req.params.id);
        // Asegura que el query param nivel se pase correctamente como número o undefined
        const nivel = req.query.nivel !== undefined ? Number(req.query.nivel) : undefined;
        const dependientes = yield (0, ubicacionesTecnicas_service_1.getUbicacionesDependientes)(idUbicacion, nivel);
        res.status(200).json({ data: dependientes });
        return;
    }
    catch (error) {
        console.error('Error in getUbicacionesDependientesHandler:', error);
        res
            .status(500)
            .json({ error: 'Error al obtener las ubicaciones dependientes' });
        return;
    }
});
exports.getUbicacionesDependientesHandler = getUbicacionesDependientesHandler;
/**
 * Obtiene todas las ubicaciones técnicas de un nivel específico.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/nivel/:nivel
 * Params:
 *   - nivel: number (en la ruta, requerido)
 * Descripción: Retorna todas las ubicaciones técnicas del nivel solicitado que están habilitadas.
 */
const getUbicacionesPorNivelHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nivel = Number(req.params.nivel);
        const ubicaciones = yield (0, ubicacionesTecnicas_service_1.getUbicacionesPorNivel)(nivel);
        res.status(200).json({ data: ubicaciones });
        return;
    }
    catch (error) {
        console.error('Error en getUbicacionesPorNivelHandler:', error);
        res
            .status(500)
            .json({ error: 'Error al obtener las ubicaciones por nivel' });
        return;
    }
});
exports.getUbicacionesPorNivelHandler = getUbicacionesPorNivelHandler;
/**
 * Exporta todas las ubicaciones técnicas a un archivo Excel.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/export/excel
 * Descripción: Genera un archivo Excel con todas las ubicaciones técnicas en un formato jerárquico.
 */
const exportUbicacionesToExcelHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buffer = yield (0, exportToExcel_1.exportUbicacionesToExcel)();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=ubicaciones_tecnicas.xlsx');
        res.send(buffer);
        return;
    }
    catch (error) {
        console.error('Error in exportUbicacionesToExcelHandler:', error);
        res.status(500).json({ error: 'Error al exportar a Excel' });
        return;
    }
});
exports.exportUbicacionesToExcelHandler = exportUbicacionesToExcelHandler;
/**
 * Obtiene todos los padres jerárquicos de un hijo.
 * Método: GET
 * Endpoint: /ubicaciones-tecnicas/padres/:idHijo
 * Params:
 *   - idHijo: number (en la ruta, requerido)
 * Descripción: Retorna todos los padres jerárquicos de la ubicación técnica indicada.
 */
const getPadresByIdHijoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idHijo = Number(req.params.idHijo);
        const padres = yield (0, ubicacionesTecnicas_service_1.getPadresByIdHijo)(idHijo);
        res.status(200).json({ data: padres });
        return;
    }
    catch (error) {
        console.error('Error in getPadresByIdHijoHandler:', error);
        res.status(500).json({ error: 'Error al obtener los padres jerárquicos' });
        return;
    }
});
exports.getPadresByIdHijoHandler = getPadresByIdHijoHandler;
