import { pgTable, serial, integer, varchar,primaryKey } from 'drizzle-orm/pg-core';
import { inspeccion } from './inspeccion';
import { table } from 'console';

export const mantenimiento_inspeccion = pgTable('mantenimientoInspeccion', {
  idMantenimiento: serial('idMantenimientoInspeccion').notNull(),
  idInspeccion: integer('idInspeccion')
    .notNull()
    .references(() => inspeccion.id),
  nombre: varchar('nombre', { length: 100 }).notNull(),
},(table) => {
  return {
    pk: primaryKey({ columns: [table.idMantenimiento, table.idInspeccion] }),
  };
});
