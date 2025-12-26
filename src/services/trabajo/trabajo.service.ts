import {eq} from 'drizzle-orm';
import {db} from '../../config/db';
import {trabajo} from '../../tables/trabajo';
import {CreateTrabajoParams} from '../../types/trabajo';
import { Tx } from '../../types/transaction';

//Get Trabajos
export const getAllTrabajos = async () => {
    try{
         const trabajos = await db.select().from(trabajo);
         return trabajos;
    }catch(error){
        console.error('Error al obtener los Trabajos', error);
        throw new Error('No se pudieron obtener los Trabajos');
    }
}

//getTrabajo by ID
export const getTrabajoById = async (id: number) => {
    try{
         const trabajoById = await db.select().from(trabajo).where(eq(trabajo.idTrabajo, id));

         return trabajoById[0] || null;
    }
    catch(error){
        console.error('Error al obtener el Trabajo por ID', error);
        throw new Error('No se pudo obtener el Trabajo por ID');
    }
}

//Post Trabajo
export const createTrabajo = async (
  params: CreateTrabajoParams,
  tx?: Tx
) => {
  const database = tx ?? db;

    try {
        const newTrabajo = await database.insert(trabajo)
        .values(params)
        .returning();

        return newTrabajo[0] || null;
    } catch (error) {
        console.error('Error al crear el Trabajo', error);
        throw new Error('No se pudo crear el Trabajo');
    }
}

//Patch Trabajo
export const updateTrabajo = async (id: number, params: Partial<CreateTrabajoParams>) => {
    if (Object.keys(params).length === 0) {
        return null; // No hay campos para actualizar
    }
    
    try{
        const updated = await db.update(trabajo)
        .set(params)
        .where(eq(trabajo.idTrabajo, id))
        .returning()

        return updated[0] || null;
    }catch(error){
        console.error(
            `Error al actualizar trabajo con ID ${id}`,
            error
        )
        throw new Error('Error al actualizar Trabajo');
    }
}

//Delete Trabajo
export const deleteTrabajo = async (id: number) => {
    try{
        const deleted = await db.delete(trabajo)
        .where(eq(trabajo.idTrabajo, id))
        .returning();

        return deleted[0] || null;
    }catch(error){
        console.error(
            `Error al eliminar trabajo con ID ${id}`, error
        )
        throw new Error('Error al eliminar Trabajo');
    }   
}