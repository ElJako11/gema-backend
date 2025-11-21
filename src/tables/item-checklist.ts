import { pgTable, serial, integer, varchar } from 'drizzle-orm/pg-core';
import { checklist } from './checklist';

export const itemChecklist = pgTable('itemChecklist', {
  idItemCheck: serial('idItemChecklist').primaryKey().notNull(),
  idCheck: integer('idChecklist')
    .primaryKey()
    .notNull()
    .references(() => checklist.idChecklist),
  descripcion: varchar('descripcion', { length: 100 }).notNull(),
});
