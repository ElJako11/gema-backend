import { pgTable, serial, integer, varchar, primaryKey } from 'drizzle-orm/pg-core';
import { plantilla } from './plantilla';

export const itemPlantilla = pgTable(
  'itemPlantilla',
  {
    idItemPlantilla: serial('idItemPlantilla').notNull(),
    idPlantilla: integer('idPlantilla')
      .notNull()
      .references(() => plantilla.idPlantilla),
    descripcion: varchar('descripcion', { length: 200 }).notNull(),
    titulo: varchar('titulo', { length: 100 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.idItemPlantilla, table.idPlantilla] }),
    };
  }
);
