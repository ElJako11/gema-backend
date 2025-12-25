import { eq, and } from 'drizzle-orm';
import { db } from '../../config/db';
import { itemPlantilla } from '../../tables/itemPlantilla';
import { plantilla } from '../../tables/plantilla';
import { cleanObject } from '../../utils/cleanUpdateData';
import { CreateItemPlantillaParams, UpdateItemPlantillaParams } from '../../types/itemPlantilla';

export const getItemsByPlantilla = async (idPlantilla: number) => {
    try {
        const plantillaExists = await db
            .select()
            .from(plantilla)
            .where(eq(plantilla.idPlantilla, idPlantilla));

        if (plantillaExists.length === 0) {
            throw new Error('La plantilla no existe');
        }

        const items = await db
            .select()
            .from(itemPlantilla)
            .where(eq(itemPlantilla.idPlantilla, idPlantilla));
        return items;
    } catch (error) {
        throw error;
    }
};

export const createItem = async (params: CreateItemPlantillaParams) => {
    try {
        const inserted = await db
            .insert(itemPlantilla)
            .values(params)
            .returning();
        return inserted[0];
    } catch (error) {
        console.error('Error al crear item de plantilla', error);
        throw new Error('No se pudo crear el item de la plantilla');
    }
};

export const updateItem = async (idItemPlantilla: number, idPlantilla: number, params: UpdateItemPlantillaParams) => {
    const valuesToUpdate = cleanObject(params);
    try {
        const updated = await db
            .update(itemPlantilla)
            .set(valuesToUpdate)
            .where(
                and(
                    eq(itemPlantilla.idItemPlantilla, idItemPlantilla),
                    eq(itemPlantilla.idPlantilla, idPlantilla)
                )
            )
            .returning();

        return updated[0];
    } catch (error) {
        console.error(`Error al actualizar item ${idItemPlantilla} de plantilla ${idPlantilla}`, error);
        throw new Error('Error al actualizar el item de la plantilla');
    }
};

export const deleteItem = async (idItemPlantilla: number, idPlantilla: number) => {
    try {
        const deleted = await db
            .delete(itemPlantilla)
            .where(
                and(
                    eq(itemPlantilla.idItemPlantilla, idItemPlantilla),
                    eq(itemPlantilla.idPlantilla, idPlantilla)
                )
            )
            .returning();

        return deleted[0];
    } catch (error) {
        console.error(`Error al eliminar item ${idItemPlantilla} de plantilla ${idPlantilla}`, error);
        throw new Error('Error al eliminar el item de la plantilla');
    }
};
