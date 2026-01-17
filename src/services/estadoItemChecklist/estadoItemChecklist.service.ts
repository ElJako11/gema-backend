import { eq, and, sql, count } from 'drizzle-orm';
import { db } from '../../config/db';
import { estadoItemChecklist } from '../../tables/estadoItemChecklist';
import { CreateEstadoItemChecklist } from '../../types/estadoItemChecklist';
import { trabajo } from '../../tables/trabajo';
import { itemChecklist } from '../../tables/item-checklist';

type EstadoItemKeys = {
  idTrabajo: number;
  idChecklist: number;
  idItemChecklist: number;
};

// Helper function to update Trabajo status based on checklist progress
const updateTrabajoStatus = async (idTrabajo: number, idChecklist: number) => {
  try {
    const totalItemsResult = await db
      .select({ count: count() })
      .from(itemChecklist)
      .where(eq(itemChecklist.idCheck, idChecklist));

    const totalItems = totalItemsResult[0].count;

    const completedItemsResult = await db
      .select({ count: count() })
      .from(estadoItemChecklist)
      .where(
        and(
          eq(estadoItemChecklist.idTrabajo, idTrabajo),
          eq(estadoItemChecklist.estado, 'COMPLETADA')
        )
      );

    const completedItems = completedItemsResult[0].count;

    // 3. Determine new status
    let newStatus = 'No empezado';

    if (totalItems > 0 && completedItems === totalItems) {
      newStatus = 'Culminado';
    } else if (completedItems > 0) {
      newStatus = 'En ejecución';
    } else {
      newStatus = 'No empezado';
    }

    await db
      .update(trabajo)
      .set({ est: newStatus })
      .where(eq(trabajo.idTrabajo, idTrabajo));
  } catch (error) {
    console.error(
      'Error updating Trabajo status in estadoItemChecklist service:',
      error
    );
  }
};

export const createEstadoItemChecklist = async (
  data: CreateEstadoItemChecklist
) => {
  try {
    const newEstadoItemChecklist = await db
      .insert(estadoItemChecklist)
      .values(data)
      // Si ya existe, actualizamos el estado en vez de dar error (Upsert)
      .onConflictDoUpdate({
        target: [
          estadoItemChecklist.idTrabajo,
          estadoItemChecklist.idChecklist,
          estadoItemChecklist.idItemChecklist,
        ],
        set: { estado: data.estado },
      })
      .returning();

    // Trigger status update
    if (newEstadoItemChecklist.length > 0) {
      await updateTrabajoStatus(data.idTrabajo, data.idChecklist);
    }

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
    const updatedEstadoItemChecklist = await db
      .update(estadoItemChecklist)
      .set({
        estado: sql<'COMPLETADA' | 'PENDIENTE'>`
                    CASE 
                        WHEN ${estadoItemChecklist.estado} = 'PENDIENTE' THEN 'COMPLETADA'::"estadoItem"
                        ELSE 'PENDIENTE'::"estadoItem"
                    END
                `,
      })
      .where(
        and(
          eq(estadoItemChecklist.idTrabajo, keys.idTrabajo),
          eq(estadoItemChecklist.idChecklist, keys.idChecklist),
          eq(estadoItemChecklist.idItemChecklist, keys.idItemChecklist)
        )
      )
      .returning();

    // Trigger status update
    if (updatedEstadoItemChecklist.length > 0) {
      await updateTrabajoStatus(keys.idTrabajo, keys.idChecklist);
    }

    return updatedEstadoItemChecklist[0] || null;
  } catch (error) {
    console.error('Error al alternar el Estado del Item', error);
    throw new Error('No se pudo alternar el Estado del Item');
  }
};

export const deleteEstadoItemChecklist = async (keys: EstadoItemKeys) => {
  try {
    const deleted = await db
      .delete(estadoItemChecklist)
      .where(
        and(
          eq(estadoItemChecklist.idTrabajo, keys.idTrabajo),
          eq(estadoItemChecklist.idChecklist, keys.idChecklist),
          eq(estadoItemChecklist.idItemChecklist, keys.idItemChecklist)
        )
      )
      .returning();

    // Trigger status update - assuming deletion counts as removing a completed item (or not completed)
    // Note: If we delete the record, we can still recalculate.
    if (deleted.length > 0) {
      await updateTrabajoStatus(keys.idTrabajo, keys.idChecklist);
    }

    return deleted[0] || null;
  } catch (error) {
    console.error('Error al eliminar el Estado del Item', error);
    throw new Error('No se pudo eliminar el Estado del Item');
  }
};
