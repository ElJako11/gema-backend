import {
  pgTable,
  integer,
  primaryKey,
  foreignKey,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { trabajo } from './trabajo';
import { checklist } from './checklist';
import { itemChecklist } from './item-checklist';

export const estadoItemEnum = pgEnum('estadoItem', [
  'COMPLETADA',
  'PENDIENTE',
]);

export const estadoItemChecklist = pgTable(
  'estadoItemChecklist',
  {
    idTrabajo: integer('idTrabajo')
      .notNull()
      .references(() => trabajo.idTrabajo),
    idChecklist: integer('idChecklist')
      .notNull()
      .references(() => checklist.idChecklist),
    idItemChecklist: integer('idItemChecklist').notNull(),
    estado: estadoItemEnum('estado').notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.idTrabajo, table.idChecklist, table.idItemChecklist],
      }),
      itemChecklistReference: foreignKey({
        columns: [table.idItemChecklist, table.idChecklist],
        foreignColumns: [itemChecklist.idItemCheck, itemChecklist.idCheck],
      }),
    };
  }
);
