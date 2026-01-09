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

export const tipoTrabajoEnum = pgEnum('tipoTrabajo', [
  'Mantenimiento',
  'Inspeccion',
]);

export const trabajo = pgTable('trabajo', {
  idTrabajo: serial('idTrabajo').primaryKey().notNull(),
  idC: integer('idChecklist').references(() => checklist.idChecklist, {
    onDelete: 'set null',
  }),
  idU: integer('idUbicacionTecnica')
    .notNull()
    .references(() => ubicacionTecnica.idUbicacion, {
      onDelete: 'restrict', // Restrict significa que no permitirá la eliminación porque ese ID está relacionado a otra tupla en otra tabla
    }),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  fecha: date('fechaCreacion').notNull(),
  est: varchar('estado', { length: 100 }).notNull(),
  tipo: tipoTrabajoEnum('tipo').notNull(),
});
