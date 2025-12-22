import {
  pgTable,
  integer,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { trabajo } from './trabajo';
import { checklist } from './checklist';
import { itemChecklist } from './item-checklist';

export const estadoItemChecklist = pgTable(
  'estadoItemChecklist',
  {
    idTrabajo: integer('idTrabajo')
      .notNull()
      .references(() => trabajo.idTrabajo),
    idChecklist: integer('idChecklist')
      .notNull()
      .references(() => checklist.idChecklist),
    idItemChecklist: integer('idItemChecklist')
      .notNull()
      .references(() => itemChecklist.idItemCheck),
    estado: varchar('estado', { length: 100 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.idTrabajo, table.idChecklist, table.idItemChecklist],
      }),
    };
  }
);
