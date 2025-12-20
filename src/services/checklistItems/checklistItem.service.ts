import { db } from '../../config/db';
import { eq } from 'drizzle-orm';

import { itemChecklist } from '../../tables/item-checklist';

import { InsertItem, UpdateItem } from '../../types/itemChecklist';

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

export const getItemsChecklist = async (id: number) => {
  const result = await db
    .select({
      titulo: itemChecklist.titulo,
      descripcion: itemChecklist.descripcion,
    })
    .from(itemChecklist)
    .where(eq(itemChecklist.idCheck, id));

  return result;
};

export const insertItem = async (insertdata: InsertItem) => {
  const { idChecklist, descripcion, titulo } = insertdata;

  if (idChecklist <= 0 || !idChecklist || isNaN(idChecklist)) {
    throw new Error('El ID recibido no es valido');
  }

  if (descripcion.length === 0) {
    throw new Error('La descripcion enviada no es valida');
  }

  if (titulo.length === 0) {
    throw new Error('La descripcion enviada no es valida');
  }

  try {
    const result = await db
      .insert(itemChecklist)
      .values({ idCheck: idChecklist, descripcion, titulo })
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

export const updateItem = async (updateAttr: UpdateItem) => {
  const { idChecklist, descripcion = '', titulo = '' } = updateAttr;

  // ! Colocar validación isNaN.
  if (!idChecklist || idChecklist <= 0) {
    throw new Error('El ID del item no es valido');
  }

  const updatevalues: Record<string, string> = {};

  if (descripcion.length !== 0) {
    updatevalues.descripcion = descripcion;
  }

  if (titulo.length !== 0) {
    updatevalues.titulo = titulo;
  }

  if (Object.keys(updatevalues).length === 0) {
    throw new Error('No existen elementos a actualizar');
  }

  try {
    const result = await db
      .update(itemChecklist)
      .set(updatevalues)
      .where(eq(itemChecklist.idItemCheck, idChecklist))
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

export const deleteItem = async (idCheck: number) => {
  // ! Colocar validación isNaN.
  if (!idCheck || idCheck <= 0) {
    throw new Error('El ID del item no es valido');
  }

  try {
    const result = await db
      .delete(itemChecklist)
      .where(eq(itemChecklist.idCheck, idCheck))
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
