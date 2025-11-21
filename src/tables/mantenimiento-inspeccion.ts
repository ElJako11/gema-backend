import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { inspeccion } from './inspeccion';

export const mantenimiento_inspeccion = pgTable('mantenimientoInspeccion', {
  idMantenimiento: serial('idMantenimientoInspeccion').primaryKey().notNull(),
  idInspeccion: integer('idInspeccion')
    .primaryKey()
    .notNull()
    .references(() => inspeccion.id),
  nombre: varchar('nombre', { length: 100 }).notNull(),
});
