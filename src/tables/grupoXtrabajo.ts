import { pgTable } from 'drizzle-orm/pg-core';
import { integer, primaryKey } from 'drizzle-orm/pg-core';
import { grupoDeTrabajo } from './grupoDeTrabajo';
import { trabajo } from './trabajo';

export const grupoXtrabajo = pgTable(
  'grupoXtrabajo',
  {
    idG: integer('idGrupo')
      .notNull()
      .references(() => grupoDeTrabajo.id, { onDelete: 'cascade' }),
    idT: integer('idTrabajo')
      .notNull()
      .references(() => trabajo.idTrabajo, { onDelete: 'cascade' }),
  },
  table => ({
    pk: primaryKey({ columns: [table.idG, table.idT] }),
  })
);
