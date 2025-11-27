"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tecnico = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.tecnico = (0, pg_core_1.pgTable)('tecnico', {
    idTecnico: (0, pg_core_1.serial)('idTecnico').primaryKey().notNull(),
    nombre: (0, pg_core_1.varchar)('nombre', { length: 50 }).notNull(),
    direccion: (0, pg_core_1.varchar)('direccion', { length: 150 }).notNull(),
});
