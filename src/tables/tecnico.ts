import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const tecnico = pgTable('tecnico', {
  idTecnico: serial('idTecnico').primaryKey().notNull(),
  nombre: varchar('nombre', { length: 50 }).notNull(),
  direccion: varchar('direccion', { length: 150 }).notNull(),
});
