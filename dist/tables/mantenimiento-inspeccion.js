"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mantenimiento_inspeccion = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const inspeccion_1 = require("./inspeccion");
exports.mantenimiento_inspeccion = (0, pg_core_1.pgTable)('mantenimientoInspeccion', {
    idMantenimiento: (0, pg_core_1.serial)('idMantenimientoInspeccion').notNull(),
    idInspeccion: (0, pg_core_1.integer)('idInspeccion')
        .notNull()
        .references(() => inspeccion_1.inspeccion.id),
    nombre: (0, pg_core_1.varchar)('nombre', { length: 100 }).notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.idMantenimiento, table.idInspeccion] }),
    };
});
