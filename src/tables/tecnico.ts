import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { core } from 'zod';
import { grupoDeTrabajo } from './grupoDeTrabajo';

export const tecnico = pgTable('tecnico', {
  idTecnico: serial('idTecnico').primaryKey().notNull(),
  idGT: integer('idGrupoDeTrabajo').notNull().references(() => grupoDeTrabajo.id),
  nombre: varchar('nombre', { length: 50 }).notNull(),
  correo: varchar('correo', { length: 100 }).notNull().unique(),
});
