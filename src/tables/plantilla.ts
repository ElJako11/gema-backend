import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const plantilla = pgTable('plantilla', {
  idPlantilla: serial('idPlantilla').primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
});
