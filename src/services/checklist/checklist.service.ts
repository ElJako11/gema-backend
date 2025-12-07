import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { checklist } from '../../tables/checklist';
import { CreateChecklistParams } from '../../types/checklist';

//Get Checklist
export const getAllChecklist = async () => {
    try{
       const checklists = await db.select().from(checklist);
       return checklists;
    }catch(error){
        console.error('Error al obtener los Checklists', error);
        throw new Error('No se pudieron obtener los Checklists');
    }
}

//Get Checklist by ID
export const getCheclistByID = async (id: number) => {
    try{
        const checklistById = await db.select().from(checklist).where(eq(checklist.idChecklist,id));

        return checklistById[0] || null;
    }catch(error){
        console.error('Error al encontrar el checklist por ID', error);
        throw new Error('No se pudo obtener el checklist por ID');
    }
} 

//Post Checklist
export const createChecklist = async (params: CreateChecklistParams) => {
    try {
        const inserted = await db.insert(checklist)
        .values(params)
        .returning();

        return inserted[0] || null;
    } catch (error) {
        console.error('Error al crear el checklist', error);
        throw new Error('No se pudo crear el checklist');
    }
}

//Patch Checklist
export const updateChecklist = async (id: number, params: Partial<CreateChecklistParams>) => {
    if (Object.keys(params).length === 0) {
        return null; // No hay campos para actualizar
    }

    try{
        const updated = await db.update(checklist)
        .set(params)
        .where(eq(checklist.idChecklist, id))
        .returning()

        return updated[0] || null;

    }catch(error){
        console.error(
            `Error al actualizar checklist con ID ${id}`,
            error
        )
        throw new Error('Error al actualizar Checklist');
    }
}

//Delete Checklist
export const deleteChecklistByID = async(id: number) =>{
    try{
        const deleted = await db
        .delete(checklist)
        .where(eq(checklist.idChecklist, id))
        .returning()

        return deleted[0] || null;

    }catch(error){
        console.error(
            `Error al eliminar la checklist ID ${id}`,
            error
        )
        throw new Error ('Error al eliminar la checklist');
    }
}