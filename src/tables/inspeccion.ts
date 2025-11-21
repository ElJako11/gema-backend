import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { trabajo } from './trabajo';

export const inspeccion = pgTable('inspeccion', {
  id: serial('idInspeccion').primaryKey().notNull(),
  idT: integer('idTrabajo')
    .primaryKey()
    .notNull()
    .references(() => trabajo.idTrabajo),
  observacion: varchar('observacion', { length: 200 }),
  frecuencia: varchar('frecuencia', { length: 100 }).notNull(),
});
