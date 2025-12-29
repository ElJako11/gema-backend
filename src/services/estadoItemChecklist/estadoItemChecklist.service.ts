import { eq, and, sql } from "drizzle-orm";
import { db } from "../../config/db";
import { estadoItemChecklist } from "../../tables/estadoItemChecklist";
import { CreateEstadoItemChecklist } from "../../types/estadoItemChecklist";

type EstadoItemKeys = {
    idTrabajo: number;
    idChecklist: number;
    idItemChecklist: number;
};

export const createEstadoItemChecklist = async (data: CreateEstadoItemChecklist) => {
    try {
        const newEstadoItemChecklist = await db
            .insert(estadoItemChecklist)
            .values(data)
            // Si ya existe, actualizamos el estado en vez de dar error (Upsert)
            .onConflictDoUpdate({
                target: [estadoItemChecklist.idTrabajo, estadoItemChecklist.idChecklist, estadoItemChecklist.idItemChecklist],
                set: { estado: data.estado }
            })
            .returning();
        return newEstadoItemChecklist[0];
    } catch (error) {
        console.error('Error al crear/actualizar el Estado del Item', error);
        throw new Error('No se pudo procesar el Estado del Item');
    }
};

export const getEstadoItemChecklist = async (keys: EstadoItemKeys) => {
    try {
        const estadoItem = await db
            .select()
            .from(estadoItemChecklist)
            .where(
                and(
                    eq(estadoItemChecklist.idTrabajo, keys.idTrabajo),
                    eq(estadoItemChecklist.idChecklist, keys.idChecklist),
                    eq(estadoItemChecklist.idItemChecklist, keys.idItemChecklist)
                )
            );
        return estadoItem[0] || null;
    } catch (error) {
        console.error('Error al obtener el Estado del Item', error);
        throw new Error('No se pudo obtener el Estado del Item');
    }
};

export const toggleEstadoItemChecklist = async (keys: EstadoItemKeys) => {
    try {
        const updatedEstadoItemChecklist = await db.update(estadoItemChecklist)
            .set({ 
                estado: sql< 'COMPLETADA' | 'PENDIENTE' >`
                    CASE 
                        WHEN ${estadoItemChecklist.estado} = 'PENDIENTE' THEN 'COMPLETADA'::"estadoItem"
                        ELSE 'PENDIENTE'::"estadoItem"
                    END
                `
            })
            .where(
                and(
                    eq(estadoItemChecklist.idTrabajo, keys.idTrabajo),
                    eq(estadoItemChecklist.idChecklist, keys.idChecklist),
                    eq(estadoItemChecklist.idItemChecklist, keys.idItemChecklist)
                )
            )
            .returning();
        
        return updatedEstadoItemChecklist[0] || null;
    } catch (error) {
        console.error('Error al alternar el Estado del Item', error);
        throw new Error('No se pudo alternar el Estado del Item');
    }
};

export const deleteEstadoItemChecklist = async (keys: EstadoItemKeys) => {
    try {
        const deleted = await db.delete(estadoItemChecklist)
            .where(
                and(
                    eq(estadoItemChecklist.idTrabajo, keys.idTrabajo),      
                    eq(estadoItemChecklist.idChecklist, keys.idChecklist),
                    eq(estadoItemChecklist.idItemChecklist, keys.idItemChecklist)
                )
            )
            .returning();
        return deleted[0] || null;
    } catch (error) {
        console.error('Error al eliminar el Estado del Item', error);
        throw new Error('No se pudo eliminar el Estado del Item');
    }
};