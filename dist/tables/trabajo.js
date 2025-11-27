"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trabajo = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const checklist_1 = require("./checklist");
const tipoEnum = (0, pg_core_1.pgEnum)('tipo', ['Mantenimiento', 'Inspeccion']);
exports.trabajo = (0, pg_core_1.pgTable)('trabajo', {
    idTrabajo: (0, pg_core_1.serial)('idTrabajo').primaryKey().notNull(),
    idC: (0, pg_core_1.integer)('idChecklist')
        .notNull()
        .references(() => checklist_1.checklist.idChecklist, {}),
    idU: (0, pg_core_1.integer)('idUbicacionTecnica').notNull(),
    nombre: (0, pg_core_1.varchar)('nombre', { length: 100 }).notNull(),
    fecha: (0, pg_core_1.date)('fechaCreacion').notNull(),
    est: (0, pg_core_1.varchar)('estado', { length: 100 }).notNull(),
    tipo: tipoEnum('tipo').notNull(),
});
