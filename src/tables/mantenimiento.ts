import {
  pgTable,
  serial,
  integer,
  date,
  varchar,
  pgEnum,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { trabajo } from './trabajo';
import { table } from 'console';

export const tipoEnum = pgEnum('tipoMantenimiento', ['Periodico', 'Condicion']);

export const mantenimiento = pgTable(
  'mantenimiento',
  {
    idMantenimiento: serial('idMantenimiento').notNull(),
    idTrabajo: integer('idTrabajo')
      .notNull()
      .references(() => trabajo.idTrabajo),
    fechaLimite: date('fechaLimite').notNull(),
    prioridad: varchar('prioridad').notNull(),
    resumen: varchar('resumen', { length: 250 }),
    tipo: tipoEnum('tipo').notNull(),
    frecuencia: varchar('frecuencia'),
    instancia: varchar('instancia'),
    condicion: varchar('condicion', { length: 100 }),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.idMantenimiento, table.idTrabajo] }),
    };
  }
);
