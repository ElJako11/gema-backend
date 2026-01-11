import { eq } from 'drizzle-orm';
import { db } from '../../config/db';

import { createTrabajo } from '../trabajo/trabajo.service';
import { createMantenimientoPreventivo } from '../mantenimientoPreventivo/mantenimientoPreventivo.service';
import { createInspeccion } from '../inspecciones/inspecciones.service';
import { getPlantillaWithItems } from '../plantilla/plantilla.service';

import { grupoXtrabajo } from '../../tables/grupoXtrabajo';
import { checklist } from '../../tables/checklist';
import { itemChecklist } from '../../tables/item-checklist';
import { estadoItemChecklist } from '../../tables/estadoItemChecklist';
import { trabajo } from '../../tables/trabajo';

import { createMantenimiento } from '../../types/mantenimiento';
import { CreateTrabajoParams } from '../../types/trabajo';
import { Trabajo } from '../../types/trabajoFacade';
import { insertInspeccion } from '../../types/inspeccion';
import { convertUtcToStr } from '../../utils/dateHandler';
import { Tx } from '../../types/transaction';

export const createTrabajoFacade = async (data: Trabajo) => {
  return await db.transaction(async tx => {
    // 1. Create Trabajo
    // Determine 'nombre'. Using especification if available, otherwise TipoTrabajo + Date.
    const nombre = `${data.tipoTrabajo} - ${
      data.fechaCreacion.toISOString().split('T')[0]
    }`;

    const trabajoParams: CreateTrabajoParams = {
      idC: null, // No checklist initially
      idU: data.idUbicacionTecnica,
      nombre: nombre,
      fecha: convertUtcToStr(data.fechaCreacion),
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
      if (!data.fechaLimite)
        throw new Error(
          'La fecha limite es requerida para crear un mantenimiento'
        );

      const mantData = {
        idTrabajo,
        fechaLimite: data.fechaLimite,
        prioridad: data.prioridad,
        resumen: data.resumen, // Mapped as requested
        tipo: data.tipoMantenimiento || 'Periodico', // Default fallback
        frecuencia: data.frecuencia,
        condicion: data.condicion,
        instancia: data.instancia,
      };
      await createMantenimientoPreventivo(mantData, tx);
    } else if (data.tipoTrabajo === 'Inspeccion') {
      if (!data.frecuencia) {
        throw new Error(
          'La frecuencia es requerida para la creacion de inspecciones'
        );
      }

      const inspData: insertInspeccion = {
        idTrabajo,
        observaciones: data.observaciones || '', // Mapped as requested
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
  idPlantilla: number,
  tx?: Tx
) => {
  const plantillaInfo = await getPlantillaWithItems(idPlantilla);

  if (!plantillaInfo) {
    throw new Error('La plantilla solicitada no existe');
  }

  const database = tx || db;

  const newChecklist = await database
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
    const newItem = await database
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

    await database.insert(estadoItemChecklist).values({
      idTrabajo: idTrabajo,
      idChecklist: idChecklist,
      idItemChecklist: newItem[0].idItemCheck,
      estado: 'PENDIENTE',
    });
  }

  const updatedTrabajo = await database
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
};
