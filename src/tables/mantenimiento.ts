import {
  pgTable,
  serial,
  integer,
  date,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { trabajo } from './trabajo';

const tipoEnum = pgEnum('tipo', ['Periodico', 'Condicion']);

export const mantenimiento = pgTable('mantenimiento', {
  idMantenimiento: serial('idMantenimiento').primaryKey().notNull(),
  idTrabajo: integer('idTrabajo')
    .primaryKey()
    .notNull()
    .references(() => trabajo.idTrabajo),
  fechaLimite: date('fechaLimite').notNull(),
  prioridad: varchar('prioridad').notNull(),
  resumen: varchar('resumen', { length: 250 }),
  tipo: tipoEnum('tipo').notNull(),
  frecuencia: varchar('frecuencia'),
  instancia: varchar('instancia'),
  condicion: varchar('condicion', { length: 100 }),
});
