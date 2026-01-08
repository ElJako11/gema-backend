import {
  pgTable,
  serial,
  integer,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { checklist } from './checklist';

export const itemChecklist = pgTable(
  'itemChecklist',
  {
    idItemCheck: serial('idItemChecklist').notNull(),
    idCheck: integer('idChecklist')
      .notNull()
      .references(() => checklist.idChecklist, {
        onDelete: 'cascade',
      }),
    descripcion: varchar('descripcion', { length: 100 }).notNull(),
    titulo: varchar('titulo', { length: 100 }).notNull(),
  },
  table => {
    return {
      pk: primaryKey({ columns: [table.idItemCheck, table.idCheck] }),
    };
  }
);
