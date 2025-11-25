import { pgTable, serial, integer, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { trabajo } from './trabajo';

export const inspeccion = pgTable('inspeccion', {
  id: serial('idInspeccion').notNull().unique(),
  idT: integer('idTrabajo')
    .notNull()
    .references(() => trabajo.idTrabajo),
  observacion: varchar('observacion', { length: 200 }),
  frecuencia: varchar('frecuencia', { length: 100 }).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.id, table.idT] }),
  };
});