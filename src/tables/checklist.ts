import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const checklist = pgTable('checklist', {
  idChecklist: serial('idChecklist').primaryKey(),
  nombre: varchar('nombre', { length: 50 }).notNull(),
});
