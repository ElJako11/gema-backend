"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checklist = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.checklist = (0, pg_core_1.pgTable)('checklist', {
    idChecklist: (0, pg_core_1.serial)('idChecklist').primaryKey(),
    nombre: (0, pg_core_1.varchar)('nombre', { length: 50 }).notNull(),
});
