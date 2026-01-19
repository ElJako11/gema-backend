import { eq } from 'drizzle-orm';
import { db } from '../../config/db';

import { createTrabajo, updateTrabajo } from '../trabajo/trabajo.service';
import {
  createMantenimientoPreventivo,
  updateMantenimientoPreventivo,
} from '../mantenimientoPreventivo/mantenimientoPreventivo.service';
import {
  createInspeccion,
  updateInspeccion,
} from '../inspecciones/inspecciones.service';
import { getPlantillaWithItems } from '../plantilla/plantilla.service';

import { grupoXtrabajo } from '../../tables/grupoXtrabajo';
import { checklist } from '../../tables/checklist';
import { itemChecklist } from '../../tables/item-checklist';
import { estadoItemChecklist } from '../../tables/estadoItemChecklist';
import { trabajo } from '../../tables/trabajo';
import { mantenimiento } from '../../tables/mantenimiento';
import { inspeccion } from '../../tables/inspeccion';

import { CreateTrabajoParams } from '../../types/trabajo';
import { Trabajo } from '../../types/trabajoFacade';
import { insertInspeccion } from '../../types/inspeccion';
import {
  convertUtcToStr,
  calculateNextGenerationDate,
} from '../../utils/dateHandler';
import { asignarGrupo } from '../grupoXtrabajo/grupoXtrabajo.service';
import { cleanObject } from '../../utils/cleanUpdateData';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';
import { usuarios } from '../../tables/usuarios';

export const createTrabajoFacade = async (data: Trabajo) => {
  return await db.transaction(async tx => {
    const trabajoParams: CreateTrabajoParams = {
      idC: null, // No checklist initially
      idU: data.idUbicacionTecnica,
      nombre: data.nombre,
      fecha: convertUtcToStr(data.fechaCreacion),
      est: 'No empezado',
      tipo: data.tipoTrabajo,
    };

    const newTrabajo = await createTrabajo(trabajoParams, tx);

    if (!newTrabajo) {
      throw new Error('Error al crear el trabajo principal');
    }

    const idTrabajo = newTrabajo.idTrabajo;

    // Calculate Next Generation Date if frequency is provided
    let fechaProximaGeneracion = undefined;
    if (data.frecuencia) {
      let baseDate = data.fechaCreacion;

      if (data.tipoTrabajo === 'Mantenimiento' && data.fechaLimite) {
        baseDate = data.fechaLimite;
      }

      const nextDate = calculateNextGenerationDate(baseDate, data.frecuencia);
      if (nextDate) {
        fechaProximaGeneracion = nextDate;
      }
    }

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
        tipo: data.tipo || 'Periodico', // Default fallback
        frecuencia: data.frecuencia,
        condicion: data.condicion,
        instancia: data.instancia,
        fechaProximaGeneracion,
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
        observaciones: data.observacion || '', // Mapped as requested
        frecuencia: data.frecuencia,
        fechaProximaGeneracion,
      };
      await createInspeccion(inspData, tx);
    }

    await asignarGrupo({ idG: data.idGrupo, idT: idTrabajo }, tx);

    return { success: true, idTrabajo };
  });
};

export const createChecklistFromTemplate = async (
  idMantenimiento: number,
  idInspeccion: number,
  idPlantilla: number
) => {
  return await db.transaction(async tx => {
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

    let result;

    if (idMantenimiento > 0) {
      result = await database
        .select({ idTrabajo: mantenimiento.idTrabajo })
        .from(mantenimiento)
        .where(eq(mantenimiento.idMantenimiento, idMantenimiento));
    } else if (idInspeccion > 0) {
      result = await database
        .select({ idTrabajo: inspeccion.idT })
        .from(inspeccion)
        .where(eq(inspeccion.id, idInspeccion));
    }

    if (!result) {
      throw new Error('No se pudo obtener el trabajo con ese ID');
    }

    const idTrabajo = result[0].idTrabajo;

    const itemsData = plantillaInfo.items.map(item => ({
      idCheck: idChecklist,
      titulo: item.titulo,
      descripcion: item.descripcion,
    }));

    const newItems = await database
      .insert(itemChecklist)
      .values(itemsData)
      .returning();

    if (newItems.length === 0) {
      throw new Error('Error al clonar item de la plantilla');
    }

    const estadosData = newItems.map(estadoItem => ({
      idTrabajo: idTrabajo!,
      idChecklist: idChecklist!,
      idItemChecklist: estadoItem.idItemCheck,
      estado: 'PENDIENTE',
    }));

    await database.insert(estadoItemChecklist).values(estadosData as any);

    const updatedTrabajo = await database
      .update(trabajo)
      .set({ idC: idChecklist })
      .where(eq(trabajo.idTrabajo, idTrabajo))
      .returning();

    if (updatedTrabajo.length === 0) {
      throw new Error('Error al asociar la checklist al trabajo');
    }

    return idChecklist;
  });
};

export const updateTrabajoFacade = async (
  ids: { idMantenimiento?: number; idInspeccion?: number },
  data: Partial<Trabajo>
) => {
  const { idMantenimiento, idInspeccion } = ids;

  let existingData: {
    idTrabajo: number;
    fechaReferencia?: string;
  } | null = null;

  if (idMantenimiento && idMantenimiento > 0) {
    const mantInfo = await db
      .select({
        idTrabajo: mantenimiento.idTrabajo,
      })
      .from(mantenimiento)
      .where(eq(mantenimiento.idMantenimiento, idMantenimiento));

    if (mantInfo.length === 0) {
      throw new Error('Mantenimiento no encontrado');
    }
    const info = mantInfo[0];
    existingData = {
      idTrabajo: info.idTrabajo,
    };
  } else if (idInspeccion && idInspeccion > 0) {
    const inspInfo = await db
      .select({
        idTrabajo: inspeccion.idT,
      })
      .from(inspeccion)
      .where(eq(inspeccion.id, idInspeccion));

    if (inspInfo.length === 0) {
      throw new Error('Inspeccion no encontrada');
    }
    const info = inspInfo[0];
    existingData = {
      idTrabajo: info.idTrabajo,
    };
  } else {
    throw new Error(
      'Debe proporcionar un ID válido de Mantenimiento o Inspección'
    );
  }

  return await db.transaction(async tx => {
    if (!existingData) return;

    const { idTrabajo } = existingData;

    const trabajoUpdateData = cleanObject({
      nombre: data.nombre,
      fecha: data.fechaCreacion
        ? convertUtcToStr(data.fechaCreacion)
        : undefined,
    });
    if (Object.keys(trabajoUpdateData).length > 0) {
      await updateTrabajo(idTrabajo, trabajoUpdateData, tx);
    }

    if (idMantenimiento && idMantenimiento > 0) {
      const mantUpdateData = cleanObject({
        tipo: data.tipo,
        fechaLimite: data.fechaLimite,
        prioridad: data.prioridad,
        frecuencia: data.frecuencia,
        resumen: data.resumen,
      });

      await updateMantenimientoPreventivo(
        mantUpdateData as any,
        idMantenimiento,
        tx
      );
    } else if (idInspeccion && idInspeccion > 0) {
      const inspUpdateData = cleanObject({
        frecuencia: data.frecuencia,
        observacion: data.observacion,
      });

      const updatePayload = {
        ...inspUpdateData,
        fechaCreacionRef: data.fechaCreacion,
      };

      await updateInspeccion(updatePayload as any, idInspeccion, tx);
    }

    return { success: true, idTrabajo };
  });
};
