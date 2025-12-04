import {eq} from 'drizzle-orm';
import {db} from '../../config/db';
import {trabajo} from '../../tables/trabajo';
import {CreateTrabajoParams} from '../../types/trabajo';

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
         return trabajoById;
    }
    catch(error){
        console.error('Error al obtener el Trabajo por ID', error);
        throw new Error('No se pudo obtener el Trabajo por ID');
    }
}

//Post Trabajo
export const createTrabajo = async (params: CreateTrabajoParams) => {
    //Validacion de campos Obligatorios
    if (!params.nombre) {
        throw new Error('El campo nombre es obligatorio');
    }
    if (!params.idC) {
        throw new Error('El campo "idChecklist" es obligatorio');
    }
    if (!params.idU) {
        throw new Error('El campo "idUbicacionTecnica" es obligatorio');
    }
    if (!params.fecha) {
        throw new Error('El campo "fecha" es obligatorio');
    }
    if (!params.est) {
        throw new Error('El campo "estado" es obligatorio');
    }
    if (!params.tipo) {
        throw new Error('El campo "tipo" es obligatorio');
    }

    try {
        const newTrabajo = await db.insert(trabajo)
        .values(params)
        .returning();
        return newTrabajo[0];
    } catch (error) {
        console.error('Error al crear el Trabajo', error);
        throw new Error('No se pudo crear el Trabajo');
    }
}

//Put Trabajo
export const updateTrabajo = async (id: number, params: CreateTrabajoParams) => {
    //Validacion de ID
    if (isNaN(id)) throw new Error('ID inválido');
    try{
        const updated = await db.update(trabajo)
        .set(params)
        .where(eq(trabajo.idTrabajo, id))
        .returning()

        //Si el idTrabajo no existe
        if (!updated[0]) throw new Error('Trabajo no encontrado');

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
    //Validacion de ID
    if (isNaN(id)) throw new Error('ID inválido');
    try{
        const deleted = await db.delete(trabajo)
        .where(eq(trabajo.idTrabajo, id))
        .returning();

        //Si el idTrabajo no existe
        if (!deleted[0]) throw new Error('Trabajo no encontrado');

    }catch(error){
        console.error(
            `Error al eliminar trabajo con ID ${id}`, error
        )
        throw new Error('Error al eliminar Trabajo');
    }   
}