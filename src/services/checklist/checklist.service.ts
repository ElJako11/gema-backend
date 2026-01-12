import { eq } from 'drizzle-orm';
import { db } from '../../config/db';

import { checklist } from '../../tables/checklist';
import { itemChecklist } from '../../tables/item-checklist';

import {
  CreateChecklistParams,
  UpdateChecklistParams,
} from '../../types/checklist';
import { Tx } from '../../types/transaction';
import { mantenimiento } from '../../tables/mantenimiento';
import { trabajo } from '../../tables/trabajo';
import { inspeccion } from '../../tables/inspeccion';

export const getAllChecklist = async () => {
  try {
    const checklists = await db.select().from(checklist);
    return checklists;
  } catch (error) {
    console.error('Error al obtener los Checklists', error);
    throw new Error('No se pudieron obtener los Checklists');
  }
};

export const getChecklistWithItems = async (id: number) => {
  try {
    const rows = await db
      .select()
      .from(checklist)
      .leftJoin(itemChecklist, eq(checklist.idChecklist, itemChecklist.idCheck))
      .where(eq(checklist.idChecklist, id));

    if (rows.length === 0) {
      throw new Error('Checklist no encontrado');
    }

    const result = {
      ...rows[0].checklist,
      items: rows.map(r => r.itemChecklist).filter(item => item !== null),
    };

    return result;
  } catch (error) {
    console.error(`Error al obtener checklist ${id} con items`, error);
    throw error;
  }
};

export const createChecklist = async (
  params: CreateChecklistParams,
  tx?: Tx
) => {
  const database = tx ?? db;

  const createChecklist = {
    nombre: params.nombre,
  };

  const idMantenimiento = parseInt(params.idMantenimiento, 10);
  const idInspeccion = parseInt(params.idInspeccion, 10);

  try {
    const inserted = await database
      .insert(checklist)
      .values(createChecklist)
      .returning();

    const idChecklist = inserted[0].idChecklist;

    let result;

    if (idMantenimiento > 0) {
      result = await database
        .select({ idTrabajo: mantenimiento.idTrabajo })
        .from(mantenimiento)
        .where(eq(mantenimiento.idMantenimiento, idMantenimiento));
    } else if (idInspeccion > 0) {
      result = await database
        .select({ idTrabajo: inspeccion.idT })
        .from(inspeccion)
        .where(eq(inspeccion.id, idInspeccion));
    }

    if (!result) {
      throw new Error('No se pudo obtener el trabajo con ese ID');
    }

    const idTrabajo = result[0].idTrabajo;

    const updateValues = {
      idC: idChecklist,
    };

    const update = await database
      .update(trabajo)
      .set(updateValues)
      .where(eq(trabajo.idTrabajo, idTrabajo))
      .returning();

    if (update.length === 0) {
      throw new Error('No se actualizo el trabajo');
    }

    return inserted[0];
  } catch (error) {
    console.error('Error al crear el checklist', error);
    throw new Error('No se pudo crear el checklist');
  }
};

export const updateChecklist = async (
  id: number,
  params: UpdateChecklistParams
) => {
  try {
    const updated = await db
      .update(checklist)
      .set(params)
      .where(eq(checklist.idChecklist, id))
      .returning();

    return updated[0];
  } catch (error) {
    console.error(`Error al actualizar checklist con ID ${id}`, error);
    throw new Error('Error al actualizar Checklist');
  }
};

export const deleteChecklistByID = async (id: number) => {
  try {
    const deleted = await db
      .delete(checklist)
      .where(eq(checklist.idChecklist, id))
      .returning();

    return deleted[0];
  } catch (error) {
    console.error(`Error al eliminar la checklist ID ${id}`, error);
    throw new Error('Error al eliminar la checklist');
  }
};
