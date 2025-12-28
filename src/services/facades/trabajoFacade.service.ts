import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { CreateWorkInput } from '../../validations/workCreationSchema';

import { createTrabajo } from '../trabajo/trabajo.service';
import { createMantenimientoPreventivo } from '../mantenimientoPreventivo/mantenimientoPreventivo.service';
import { createInspeccion } from '../inspecciones/inspecciones.service';
import { getPlantillaWithItems } from '../plantilla/plantilla.service';

import { grupoXtrabajo } from '../../tables/grupoXtrabajo';
import { checklist } from '../../tables/checklist';
import { itemChecklist } from '../../tables/item-checklist';
import { estadoItemChecklist } from '../../tables/estadoItemChecklist';
import { trabajo } from '../../tables/trabajo';

import { CreateTrabajoParams } from '../../types/trabajo';
import { createMantenimiento } from '../../types/mantenimiento';
import { insertInspeccion } from '../../types/inspeccion';
import { convertToISOStr } from '../../utils/dateHandler';

export const createTrabajoFacade = async (data: CreateWorkInput) => {
  return await db.transaction(async (tx) => {
    // 1. Create Trabajo
    // Determine 'nombre'. Using especification if available, otherwise TipoTrabajo + Date.
    const nombre = data.especificacion || `${data.tipoTrabajo} - ${data.fechaCreacion.toISOString().split('T')[0]}`;

    const trabajoParams: CreateTrabajoParams = {
      idC: null, // No checklist initially
      idU: data.idUbicacionTecnica,
      nombre: nombre,
      fecha: convertToISOStr(data.fechaCreacion),
      est: 'No empezado',
      tipo: data.tipoTrabajo,
    };

    const newTrabajo = await createTrabajo(trabajoParams, tx);
    if (!newTrabajo) {
      throw new Error('Error al crear el trabajo principal');
    }

    const idTrabajo = newTrabajo.idTrabajo;

    // 2. Insert into Mantenimiento or Inspeccion
    if (data.tipoTrabajo === 'Mantenimiento') {
      const mantData: createMantenimiento = {
        idTrabajo,
        fechaLimite: data.fechaLimite,
        prioridad: data.prioridad,
        resumen: data.especificacion, // Mapped as requested
        tipo: data.tipoMantenimiento || 'Periodico', // Default fallback
        frecuencia: data.frecuencia,
        condicion: data.condicion,
        instancia: data.instancia,
      };
      await createMantenimientoPreventivo(mantData, tx);
    } else if (data.tipoTrabajo === 'Inspeccion') {
      const inspData: insertInspeccion = {
        idTrabajo,
        observaciones: data.especificacion || '', // Mapped as requested
        frecuencia: data.frecuencia,
      };
      await createInspeccion(inspData, tx);
    }

    // 3. Insert into GrupoXTrabajo
    await tx.insert(grupoXtrabajo).values({
      idG: data.idGrupo,
      idT: idTrabajo,
    });

    return { success: true, idTrabajo };
  });
};

export const createChecklistFromTemplate = async (
  idTrabajo: number,
  idPlantilla: number
) => {
  const plantillaInfo = await getPlantillaWithItems(idPlantilla);

  if (!plantillaInfo) {
    throw new Error('La plantilla solicitada no existe');
  }

  return await db.transaction(async (tx) => {
    const newChecklist = await tx
      .insert(checklist)
      .values({
        nombre: plantillaInfo.nombre,
      })
      .returning();

    if (newChecklist.length === 0) {
      throw new Error('Error al crear la checklist desde plantilla');
    }

    const idChecklist = newChecklist[0].idChecklist;

    for (const item of plantillaInfo.items) {
      const newItem = await tx
        .insert(itemChecklist)
        .values({
          idCheck: idChecklist,
          titulo: item.titulo,
          descripcion: item.descripcion,
        })
        .returning();

      if (newItem.length === 0) {
        throw new Error('Error al clonar item de la plantilla');
      }

      await tx.insert(estadoItemChecklist).values({
        idTrabajo: idTrabajo,
        idChecklist: idChecklist,
        idItemChecklist: newItem[0].idItemCheck,
        estado: 'PENDIENTE',
      });
    }

    const updatedTrabajo = await tx
      .update(trabajo)
      .set({ idC: idChecklist })
      .where(eq(trabajo.idTrabajo, idTrabajo))
      .returning();

    if (updatedTrabajo.length === 0) {
      throw new Error('Error al asociar la checklist al trabajo');
    }

    return {
      success: true,
      idChecklist,
      itemsCreated: plantillaInfo.items.length,
    };
  });
};
