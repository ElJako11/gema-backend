"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mantenimiento = exports.tipoEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const trabajo_1 = require("./trabajo");
exports.tipoEnum = (0, pg_core_1.pgEnum)('tipo', ['Periodico', 'Condicion']);
exports.mantenimiento = (0, pg_core_1.pgTable)('mantenimiento', {
    idMantenimiento: (0, pg_core_1.serial)('idMantenimiento').notNull(),
    idTrabajo: (0, pg_core_1.integer)('idTrabajo')
        .notNull()
        .references(() => trabajo_1.trabajo.idTrabajo),
    fechaLimite: (0, pg_core_1.date)('fechaLimite').notNull(),
    prioridad: (0, pg_core_1.varchar)('prioridad').notNull(),
    resumen: (0, pg_core_1.varchar)('resumen', { length: 250 }),
    tipo: (0, exports.tipoEnum)('tipo').notNull(),
    frecuencia: (0, pg_core_1.varchar)('frecuencia'),
    instancia: (0, pg_core_1.varchar)('instancia'),
    condicion: (0, pg_core_1.varchar)('condicion', { length: 100 }),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.idMantenimiento, table.idTrabajo] }),
    };
});
