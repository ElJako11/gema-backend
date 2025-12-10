import { pgTable, integer, primaryKey} from "drizzle-orm/pg-core";
import { grupoDeTrabajo } from "./grupoDeTrabajo";
import { trabajo } from "./trabajo";

export const grupoXtrabajo = pgTable('grupoXtrabajo', {
    idG: integer('idGrupo').notNull().references(() => grupoDeTrabajo.id, {}),
    idT: integer('idTrabajo').notNull().references(() => trabajo.idTrabajo, {}),
}, (table) => ({
    pk: primaryKey({columns: [table.idG, table.idT]})
})
)