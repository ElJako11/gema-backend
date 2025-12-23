import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { plantilla } from '../../tables/plantilla';
import { CreatePlantillaParams, UpdatePlantillaParams } from '../../types/plantilla';

export const getAllPlantillas = async () => {
    try{
       const plantillas = await db.select().from(plantilla);
       return plantillas;
    }catch(error){
        console.error('Error al obtener las Plantillas', error);
        throw new Error('No se pudieron obtener las Plantillas');
    }
}

export const createPlantilla = async (params: CreatePlantillaParams) => {
    try {
        const inserted = await db.insert(plantilla)
        .values(params)
        .returning();

        return inserted[0];
    } catch (error) {
        console.error('Error al crear la plantilla', error);
        throw new Error('No se pudo crear la plantilla');
    }
}

export const updatePlantilla = async (id: number, params: UpdatePlantillaParams) => {
    try{
        const updated = await db.update(plantilla)
        .set(params)
        .where(eq(plantilla.idPlantilla, id))
        .returning()

        if (!updated[0]) throw new Error('Plantilla no encontrada');

        return updated[0]

    }catch(error){
        console.error(
            `Error al actualizar plantilla con ID ${id}`,
            error
        )
        throw new Error('Error al actualizar Plantilla');
    }
}

export const deletePlantillaByID = async(id: number) =>{
    try{
        const deleted = await db
        .delete(plantilla)
        .where(eq(plantilla.idPlantilla, id))
        .returning()

        if (!deleted[0]) throw new Error('Plantilla no encontrada');

        return deleted[0]

    }catch(error){
        console.error(
            `Error al eliminar la plantilla ID ${id}`,
            error
        )
        throw new Error ('Error al eliminar la plantilla');
    }
}
