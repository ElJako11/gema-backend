"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grupoDeTrabajo = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const usuarios_1 = require("./usuarios");
exports.grupoDeTrabajo = (0, pg_core_1.pgTable)('GrupoDeTrabajo', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    codigo: (0, pg_core_1.varchar)('codigo', { length: 10 }).notNull().unique(),
    nombre: (0, pg_core_1.varchar)('nombre', { length: 40 }).notNull(),
    area: (0, pg_core_1.varchar)('area', { length: 20 }).notNull(),
    supervisorId: (0, pg_core_1.integer)('supervisor').references(() => usuarios_1.usuarios.Id, {
        onDelete: 'set null',
    }),
});
