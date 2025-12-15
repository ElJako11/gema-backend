import {
  pgTable,
  integer,
  serial,
  varchar,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { checklist } from './checklist';
import { ubicacionTecnica } from './ubicacionTecnica';

const tipoTrabajoEnum = pgEnum('tipoTrabajo', ['Mantenimiento', 'Inspeccion']);

export const trabajo = pgTable('trabajo', {
  idTrabajo: serial('idTrabajo').primaryKey().notNull(),
  idC: integer('idChecklist')
    .notNull()
    .references(() => checklist.idChecklist, {}),
  idU: integer('idUbicacionTecnica')
    .notNull()
    .references(() => ubicacionTecnica.idUbicacion),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  fecha: date('fechaCreacion').notNull(),
  est: varchar('estado', { length: 100 }).notNull(),
  tipo: tipoTrabajoEnum('tipo').notNull(),
});
