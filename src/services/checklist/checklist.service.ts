import { eq } from 'drizzle-orm';
import { db } from '../../config/db';

import { checklist } from '../../tables/checklist';
import { itemChecklist } from '../../tables/item-checklist';

import { CreateChecklistParams } from '../../types/checklist';
import { Tx } from '../../types/transaction';



export const getAllChecklist = async () => {
    try{
       const checklists = await db.select().from(checklist);
       return checklists;
    }catch(error){
        console.error('Error al obtener los Checklists', error);
        throw new Error('No se pudieron obtener los Checklists');
    }
}

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
            items: rows.map(r => r.itemChecklist).filter(item => item !== null)
        };

        return result;
    } catch (error) {
        console.error(`Error al obtener checklist ${id} con items`, error);
        throw error;
    }
}

export const createChecklist = async (
  params: CreateChecklistParams,
  tx?: Tx
) => {
  const database = tx ?? db;
    try {
        const inserted = await database.insert(checklist)
        .values(params)
        .returning();

        return inserted[0];
    } catch (error) {
        console.error('Error al crear el checklist', error);
        throw new Error('No se pudo crear el checklist');
    }
}

export const updateChecklist = async (id: number, params: CreateChecklistParams) => {
    try{
        const updated = await db.update(checklist)
        .set(params)
        .where(eq(checklist.idChecklist, id))
        .returning()

        return updated[0]

    }catch(error){
        console.error(
            `Error al actualizar checklist con ID ${id}`,
            error
        )
        throw new Error('Error al actualizar Checklist');
    }
}

export const deleteChecklistByID = async(id: number) =>{
    try{
        const deleted = await db
        .delete(checklist)
        .where(eq(checklist.idChecklist, id))
        .returning();

        return deleted[0]

    }catch(error){
        console.error(
            `Error al eliminar la checklist ID ${id}`,
            error
        )
        throw new Error ('Error al eliminar la checklist');
    }
}