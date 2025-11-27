"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspeccion = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const trabajo_1 = require("./trabajo");
exports.inspeccion = (0, pg_core_1.pgTable)('inspeccion', {
    id: (0, pg_core_1.serial)('idInspeccion').notNull().unique(),
    idT: (0, pg_core_1.integer)('idTrabajo')
        .notNull()
        .references(() => trabajo_1.trabajo.idTrabajo),
    observacion: (0, pg_core_1.varchar)('observacion', { length: 200 }),
    frecuencia: (0, pg_core_1.varchar)('frecuencia', { length: 100 }).notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.id, table.idT] }),
    };
});
