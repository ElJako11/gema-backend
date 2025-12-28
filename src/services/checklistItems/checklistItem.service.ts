import { db } from '../../config/db';
import { eq, and } from 'drizzle-orm';
import { cleanObject } from '../../utils/cleanUpdateData';

import { itemChecklist } from '../../tables/item-checklist';
import { estadoItemChecklist } from '../../tables/estadoItemChecklist';
import { checklist } from '../../tables/checklist';

import { InsertItem, UpdateItem } from '../../types/itemChecklist';
import { Tx } from '../../types/transaction';
import { trabajo } from '../../tables/trabajo';

export const getAllItems = async () => {
  try {
    const result = await db.select().from(itemChecklist);

    if (result.length === 0) {
      return [];
    }

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const insertItem = async (
  insertdata: InsertItem,
  tx?: Tx
) => {
  const database = tx ?? db;
  const { idChecklist, descripcion, titulo } = insertdata;
  try {
    const result = await database
      .insert(itemChecklist)
      .values({ idCheck: idChecklist, descripcion, titulo })
      .returning({ idItemCheck: itemChecklist.idItemCheck });

      const idTrabajo = await database
      .select({ idTrabajo: trabajo.idTrabajo })
      .from(trabajo)
      .where(eq(trabajo.idC, idChecklist))
      .limit(1);

      await database
      .insert(estadoItemChecklist)
      .values({ idItemChecklist: result[0].idItemCheck, idChecklist, estado: 'PENDIENTE', idTrabajo: idTrabajo[0].idTrabajo})
      .returning();

    if (result.length === 0) {
      throw new Error('El item no fue creado correctamente');
    }

    return result[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateItem = async (
  idChecklist: number,
  idItem: number,
  updateAttr: UpdateItem
) => {
  const updatevalues = cleanObject(updateAttr);
  
  try {
    const result = await db
      .update(itemChecklist)
      .set(updatevalues)
      .where(
        and(
          eq(itemChecklist.idCheck, idChecklist),
          eq(itemChecklist.idItemCheck, idItem)
        )
      )
      .returning();

    if (result.length === 0) {
      throw new Error('El item no se actualizo correctamente');
    }

    return result[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteItem = async (idCheck: number, idItemCheck: number) => {
  try {
    // Primero eliminar de estadoItemChecklist debido a la restricción de clave foránea
    await db
      .delete(estadoItemChecklist)
      .where(
        and(
          eq(estadoItemChecklist.idChecklist, idCheck),
          eq(estadoItemChecklist.idItemChecklist, idItemCheck)
        )
      );

    // Luego eliminar de itemChecklist
    const result = await db
      .delete(itemChecklist)
      .where(
        and(
          eq(itemChecklist.idCheck, idCheck),
          eq(itemChecklist.idItemCheck, idItemCheck)
        )
      )
      .returning({ deletedItem: itemChecklist.idCheck });

    if (result.length === 0) {
      throw new Error('El item no se elimino correctamente');
    }

    return result[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
