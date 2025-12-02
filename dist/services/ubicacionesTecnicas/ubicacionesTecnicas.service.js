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
exports.getPadresByIdHijo = exports.getUbicacionesDependientes = exports.getUbicacionesPorNivel = exports.getUbicacionTecnicaById = exports.getUbicacionesTecnicas = exports.deleteUbicacionTecnica = exports.updateUbicacionTecnica = exports.createUbicacionTecnica = void 0;
const db_1 = require("../../config/db");
const ubicacionTecnica_1 = require("../../tables/ubicacionTecnica");
const incluyen_1 = require("../../tables/incluyen");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * Crea una nueva ubicación técnica.
 * @param params Objeto con los datos de la ubicación técnica a crear
 *   - descripcion: string (requerido)
 *   - abreviacion: string (requerido)
 *   - padres: Array<{ idPadre: number; esUbicacionFisica?: boolean }> (opcional)
 *     - idPadre: ID del padre
 *     - esUbicacionFisica: true si este padre es la ubicación física principal
 * @returns Objeto con mensaje y la ubicación creada
 * Endpoint: POST /ubicaciones-tecnicas
 * Ejemplo de body para padres:
 *   padres: [
 *     { idPadre: 1, esUbicacionFisica: true },
 *     { idPadre: 2 }
 *   ]
 * Si hay varios padres, solo uno debe tener esUbicacionFisica: true (el resto se asume false).
 */
const createUbicacionTecnica = (params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!params.descripcion || !params.abreviacion) {
            throw new Error('Los campos descripcion y abreviacion son obligatorios');
        }
        let nivel = 1;
        let codigo_Identificacion = params.abreviacion;
        if (params.padres && params.padres.length > 0) {
            // Buscar el padre con esUbicacionFisica true
            const padreFisico = params.padres.find(p => p.esUbicacionFisica);
            const padreIdParaCodigo = padreFisico
                ? padreFisico.idPadre
                : params.padres[0].idPadre;
            const padresIds = params.padres.map(p => p.idPadre);
            const padres = yield db_1.db
                .select()
                .from(ubicacionTecnica_1.ubicacionTecnica)
                .where((0, drizzle_orm_1.inArray)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, padresIds));
            const padreParaCodigo = padres.find(p => p.idUbicacion === padreIdParaCodigo);
            if (!padreParaCodigo) {
                throw new Error('El padre para el código no existe');
            }
            nivel = ((_a = padreParaCodigo.nivel) !== null && _a !== void 0 ? _a : 0) + 1;
            codigo_Identificacion = `${padreParaCodigo.codigo_Identificacion}-${params.abreviacion}`;
        }
        const inserted = yield db_1.db
            .insert(ubicacionTecnica_1.ubicacionTecnica)
            .values({
            descripcion: params.descripcion,
            abreviacion: params.abreviacion,
            codigo_Identificacion,
            nivel,
        })
            .returning();
        if (!inserted.length) {
            throw new Error('Error al crear la ubicación técnica');
        }
        const idHijo = inserted[0].idUbicacion;
        if (params.padres && params.padres.length > 0) {
            for (const padre of params.padres) {
                yield db_1.db.insert(incluyen_1.incluyen).values({
                    idPadre: padre.idPadre,
                    idHijo,
                    esUbicacionFisica: (_b = padre.esUbicacionFisica) !== null && _b !== void 0 ? _b : false,
                });
            }
        }
        return {
            message: 'Ubicación técnica creada correctamente',
            ubicacion: inserted[0],
        };
    }
    catch (error) {
        console.error('Error creating ubicacion tecnica:', error);
        // Lanzar el error real junto con el mensaje personalizado
        throw new Error(`Error al crear la ubicación técnica: ${error instanceof Error ? error.message : error}`);
    }
});
exports.createUbicacionTecnica = createUbicacionTecnica;
/**
 * Actualiza una ubicación técnica existente.
 * @param idUbicacion ID de la ubicación técnica a actualizar
 * @param params Objeto con los datos a actualizar
 *   - descripcion: string (opcional)
 *   - abreviacion: string (opcional)
 *   - padres: Array<{ idPadre: number; esUbicacionFisica?: boolean }> (opcional)
 * @returns Objeto con mensaje y la ubicación actualizada
 * Endpoint: PUT /ubicaciones-tecnicas/:id
 * Ejemplo de body para padres igual que en creación.
 */
const updateUbicacionTecnica = (idUbicacion, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const updateData = {};
        if (params.descripcion !== undefined)
            updateData.descripcion = params.descripcion;
        if (params.abreviacion !== undefined)
            updateData.abreviacion = params.abreviacion;
        // Only recalculate nivel and codigo_Identificacion if padres is present in the request
        if (params.padres && params.padres.length > 0) {
            const padresIds = params.padres.map(p => p.idPadre);
            const padres = yield db_1.db
                .select()
                .from(ubicacionTecnica_1.ubicacionTecnica)
                .where((0, drizzle_orm_1.inArray)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, padresIds));
            const padreFisico = params.padres.find(p => p.esUbicacionFisica);
            const padreIdParaCodigo = padreFisico
                ? padreFisico.idPadre
                : params.padres[0].idPadre;
            const padreParaCodigo = padres.find(p => p.idUbicacion === padreIdParaCodigo);
            let nivel;
            let codigo_Identificacion;
            if (padreParaCodigo) {
                nivel = ((_a = padreParaCodigo.nivel) !== null && _a !== void 0 ? _a : 0) + 1;
                codigo_Identificacion = `${(_b = padreParaCodigo.codigo_Identificacion) !== null && _b !== void 0 ? _b : ''}-${(_c = params.abreviacion) !== null && _c !== void 0 ? _c : ''}`;
            }
            else {
                nivel = 1;
                codigo_Identificacion = (_d = params.abreviacion) !== null && _d !== void 0 ? _d : '';
            }
            updateData.nivel = nivel;
            updateData.codigo_Identificacion = codigo_Identificacion;
        }
        const updated = yield db_1.db
            .update(ubicacionTecnica_1.ubicacionTecnica)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, idUbicacion))
            .returning();
        if (!updated.length) {
            throw new Error('Ubicación técnica no encontrada o sin cambios');
        }
        if (params.padres) {
            yield db_1.db.delete(incluyen_1.incluyen).where((0, drizzle_orm_1.eq)(incluyen_1.incluyen.idHijo, idUbicacion));
            for (const padre of params.padres) {
                yield db_1.db.insert(incluyen_1.incluyen).values({
                    idPadre: padre.idPadre,
                    idHijo: idUbicacion,
                    esUbicacionFisica: (_e = padre.esUbicacionFisica) !== null && _e !== void 0 ? _e : false,
                });
            }
        }
        return {
            message: 'Ubicación técnica actualizada correctamente',
            ubicacion: updated[0],
        };
    }
    catch (error) {
        console.error('Error updating ubicacion tecnica:', error);
        throw new Error(`Error al actualizar la ubicación técnica: ${error instanceof Error ? error.message : error}`);
    }
});
exports.updateUbicacionTecnica = updateUbicacionTecnica;
/**
 * Elimina una ubicación técnica por su ID y elimina recursivamente todos los hijos donde este sea padre (sin importar esUbicacionFisica).
 * @param idUbicacion ID de la ubicación técnica a eliminar
 * @returns Objeto con mensaje y la ubicación eliminada
 * Endpoint: DELETE /ubicaciones-tecnicas/:id
 * Descripción: Elimina la ubicación técnica y, en cascada, todos los hijos cuya relación apunte a este padre.
 */
const deleteUbicacionTecnica = (idUbicacion) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Buscar todos los hijos donde este es padre (sin importar esUbicacionFisica)
        const hijos = yield db_1.db
            .select({ idHijo: incluyen_1.incluyen.idHijo })
            .from(incluyen_1.incluyen)
            .where((0, drizzle_orm_1.eq)(incluyen_1.incluyen.idPadre, idUbicacion));
        // Deshabilitar recursivamente los hijos
        for (const hijo of hijos) {
            yield (0, exports.deleteUbicacionTecnica)(hijo.idHijo);
        }
        // Eliminar relaciones en Incluyen donde este es hijo
        yield db_1.db.delete(incluyen_1.incluyen).where((0, drizzle_orm_1.eq)(incluyen_1.incluyen.idHijo, idUbicacion));
        // Eliminar relaciones en Incluyen donde este es padre
        yield db_1.db.delete(incluyen_1.incluyen).where((0, drizzle_orm_1.eq)(incluyen_1.incluyen.idPadre, idUbicacion));
        // En vez de eliminar, deshabilitar la ubicación técnica
        const updated = yield db_1.db
            .update(ubicacionTecnica_1.ubicacionTecnica)
            .set({ estaHabilitado: false })
            .where((0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, idUbicacion))
            .returning();
        if (!updated.length) {
            throw new Error('Ubicación técnica no encontrada');
        }
        return {
            message: 'Ubicación técnica deshabilitada correctamente',
            ubicacion: updated[0],
        };
    }
    catch (error) {
        console.error('Error disabling ubicacion tecnica:', error);
        throw new Error(`Error al deshabilitar la ubicación técnica: ${error instanceof Error ? error.message : error}`);
    }
});
exports.deleteUbicacionTecnica = deleteUbicacionTecnica;
/**
 * Obtiene todas las ubicaciones técnicas.
 * @returns Array de todas las ubicaciones técnicas
 * Endpoint: GET /ubicaciones-tecnicas
 */
const getUbicacionesTecnicas = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Obtener todas las ubicaciones habilitadas
        const ubicaciones = yield db_1.db
            .select()
            .from(ubicacionTecnica_1.ubicacionTecnica)
            .where((0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.estaHabilitado, true));
        // 2. Obtener todas las relaciones padre-hijo
        const relaciones = yield db_1.db.select().from(incluyen_1.incluyen);
        // 3. Crear un mapa de ubicaciones por id
        const ubicacionMap = new Map();
        for (const u of ubicaciones) {
            ubicacionMap.set(u.idUbicacion, Object.assign(Object.assign({}, u), { children: [] }));
        }
        // 4. Construir el árbol
        const hijosSet = new Set();
        for (const rel of relaciones) {
            const padre = ubicacionMap.get(rel.idPadre);
            const hijo = ubicacionMap.get(rel.idHijo);
            if (padre && hijo) {
                padre.children.push(hijo);
                hijosSet.add(hijo.idUbicacion);
            }
        }
        // 5. Los nodos raíz son los que no son hijos de nadie
        const roots = Array.from(ubicacionMap.values()).filter(node => !hijosSet.has(node.idUbicacion));
        return roots;
    }
    catch (error) {
        console.error('Error fetching ubicaciones tecnicas:', error);
        throw new Error(`Error al obtener las ubicaciones técnicas: ${error instanceof Error ? error.message : error}`);
    }
});
exports.getUbicacionesTecnicas = getUbicacionesTecnicas;
/**
 * Obtiene una ubicación técnica por su ID.
 * @param idUbicacion ID de la ubicación técnica
 * @returns La ubicación técnica correspondiente
 * Endpoint: GET /ubicaciones-tecnicas/:id
 */
const getUbicacionTecnicaById = (idUbicacion) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicacion = yield db_1.db
            .select()
            .from(ubicacionTecnica_1.ubicacionTecnica)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, idUbicacion), (0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.estaHabilitado, true)));
        if (!ubicacion.length) {
            throw new Error('Ubicación técnica no encontrada');
        }
        return ubicacion[0];
    }
    catch (error) {
        console.error('Error fetching ubicacion tecnica by id:', error);
        throw new Error(`Error al obtener la ubicación técnica: ${error instanceof Error ? error.message : error}`);
    }
});
exports.getUbicacionTecnicaById = getUbicacionTecnicaById;
/**
 * Obtiene todas las ubicaciones técnicas de un nivel específico.
 * @param nivel El nivel jerárquico a filtrar
 * @returns Array de ubicaciones técnicas en ese nivel
 * Endpoint: GET /ubicaciones-tecnicas/nivel/:nivel
 */
const getUbicacionesPorNivel = (nivel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ubicaciones = yield db_1.db
            .select()
            .from(ubicacionTecnica_1.ubicacionTecnica)
            .where((0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.estaHabilitado, true));
        return ubicaciones.filter(u => u.nivel === nivel);
    }
    catch (error) {
        console.error('Error fetching ubicaciones por nivel:', error);
        throw new Error(`Error al obtener las ubicaciones por nivel: ${error instanceof Error ? error.message : error}`);
    }
});
exports.getUbicacionesPorNivel = getUbicacionesPorNivel;
/**
 * Obtiene todas las ubicaciones dependientes (descendientes) de una ubicación dada.
 * @param idUbicacion ID de la ubicación raíz
 * @param nivel (opcional) nivel jerárquico a filtrar (query param opcional)
 * @returns Array de ubicaciones dependientes (descendientes). Si se indica nivel, solo retorna las de ese nivel.
 * Endpoint: GET /ubicaciones-tecnicas/ramas/:id?nivel=4
 * Nota: El parámetro nivel es opcional y solo filtra si se provee.
 */
const getUbicacionesDependientes = (idUbicacion_1, nivel_1, ...args_1) => __awaiter(void 0, [idUbicacion_1, nivel_1, ...args_1], void 0, function* (idUbicacion, nivel, visitados = new Set()) {
    try {
        let dependientes = [];
        const hijos = yield db_1.db
            .select({ idHijo: incluyen_1.incluyen.idHijo })
            .from(incluyen_1.incluyen)
            .where((0, drizzle_orm_1.eq)(incluyen_1.incluyen.idPadre, idUbicacion));
        for (const hijo of hijos) {
            if (visitados.has(hijo.idHijo))
                continue; // Evita ciclos y duplicados
            visitados.add(hijo.idHijo);
            const ubicacionArr = yield db_1.db
                .select()
                .from(ubicacionTecnica_1.ubicacionTecnica)
                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, hijo.idHijo), (0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.estaHabilitado, true)));
            if (ubicacionArr.length) {
                const ubicacion = ubicacionArr[0];
                if (nivel === undefined || ubicacion.nivel === nivel) {
                    dependientes.push(ubicacion);
                }
                // Siempre sigue recorriendo para encontrar descendientes que sí cumplan el nivel
                const subdependientes = yield (0, exports.getUbicacionesDependientes)(hijo.idHijo, nivel, visitados);
                dependientes.push(...subdependientes);
            }
        }
        return dependientes;
    }
    catch (error) {
        console.error('Error fetching ubicaciones dependientes:', error);
        throw new Error(`Error al obtener las ubicaciones dependientes: ${error instanceof Error ? error.message : error}`);
    }
});
exports.getUbicacionesDependientes = getUbicacionesDependientes;
/**
 * Obtiene la(s) cadena(s) jerárquica(s) de padres hasta el hijo dado, en estructura padre-hijo.
 * @param idHijo ID de la ubicación técnica hija
 * @returns Array de árboles desde la(s) raíz(ces) hasta el hijo, estructura padre→hijo
 * Ejemplo de retorno:
 * [
 *   { ...padre1, child: { ...padre2, child: { ...hijo } } },
 *   { ...padreX, child: { ...hijo } }
 * ]
 */
const getPadresByIdHijo = (idHijo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Buscar todos los padres directos de este hijo, incluyendo esUbicacionFisica
        const padresRel = yield db_1.db
            .select({
            idPadre: incluyen_1.incluyen.idPadre,
            esUbicacionFisica: incluyen_1.incluyen.esUbicacionFisica,
        })
            .from(incluyen_1.incluyen)
            .where((0, drizzle_orm_1.eq)(incluyen_1.incluyen.idHijo, idHijo));
        if (!padresRel.length) {
            return [];
        }
        const padres = [];
        for (const rel of padresRel) {
            const padreArr = yield db_1.db
                .select()
                .from(ubicacionTecnica_1.ubicacionTecnica)
                .where((0, drizzle_orm_1.eq)(ubicacionTecnica_1.ubicacionTecnica.idUbicacion, rel.idPadre));
            if (padreArr.length) {
                const padre = padreArr[0];
                padres.push({
                    idUbicacion: padre.idUbicacion,
                    descripcion: padre.descripcion,
                    abreviacion: padre.abreviacion,
                    codigo_Identificacion: padre.codigo_Identificacion,
                    estaHabilitado: padre.estaHabilitado,
                    nivel: padre.nivel,
                    esUbicacionFisica: rel.esUbicacionFisica,
                });
            }
        }
        return padres;
    }
    catch (error) {
        console.error('Error fetching padres by idHijo:', error);
        throw new Error(`Error al obtener los padres directos: ${error instanceof Error ? error.message : error}`);
    }
});
exports.getPadresByIdHijo = getPadresByIdHijo;
