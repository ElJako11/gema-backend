"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemChecklist = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const checklist_1 = require("./checklist");
exports.itemChecklist = (0, pg_core_1.pgTable)('itemChecklist', {
    idItemCheck: (0, pg_core_1.serial)('idItemChecklist').notNull(),
    idCheck: (0, pg_core_1.integer)('idChecklist')
        .notNull()
        .references(() => checklist_1.checklist.idChecklist),
    descripcion: (0, pg_core_1.varchar)('descripcion', { length: 100 }).notNull(),
}, (table) => {
    return {
        pk: (0, pg_core_1.primaryKey)({ columns: [table.idItemCheck, table.idCheck] }),
    };
});
