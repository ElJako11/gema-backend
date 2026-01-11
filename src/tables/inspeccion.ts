import {
  pgTable,
  serial,
  integer,
  varchar,
  primaryKey,
  boolean,
} from 'drizzle-orm/pg-core';
import { trabajo } from './trabajo';

export const inspeccion = pgTable(
  'inspeccion',
  {
    id: serial('idInspeccion').notNull().unique(),
    idT: integer('idTrabajo')
      .notNull()
      .references(() => trabajo.idTrabajo, {
        onDelete: 'cascade',
      }),
    observacion: varchar('observacion', { length: 200 }),
    frecuencia: varchar('frecuencia', { length: 100 }).notNull(),
    siguienteCreado: boolean('siguienteCreado').default(false),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.id, table.idT] }),
    };
  }
);
