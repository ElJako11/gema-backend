import { eq, and } from "drizzle-orm";
import { db } from "../../config/db";
import { estadoItemChecklist } from "../../tables/estadoItemChecklist";
import { CreateEstadoItemChecklist } from "../../types/estadoItemChecklist";

// Tipo auxiliar para las claves
type EstadoItemKeys = {
    idTrabajo: number;
    idChecklist: number;
    idItemChecklist: number;
};

// Create
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

// Get By Keys
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

// Patch (Actualizar solo estado)
export const patchEstadoItemChecklist = async (keys: EstadoItemKeys, nuevoEstado: 'COMPLETADA' | 'PENDIENTE') => {
    try {
        const updatedEstadoItemChecklist = await db.update(estadoItemChecklist)
            .set({ estado: nuevoEstado })
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
        console.error('Error al actualizar el Estado del Item', error);
        throw new Error('No se pudo actualizar el Estado del Item');
    }
};

// Delete
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