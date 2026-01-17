import { db } from '../../config/db';

import { eq, between, and, count, ne } from 'drizzle-orm';

import { mantenimiento } from '../../tables/mantenimiento';
import { trabajo } from '../../tables/trabajo';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';

import {
  createMantenimiento,
  updateMantenimiento,
} from '../../types/mantenimiento';
import { Tx } from '../../types/transaction';

import {
  getEndOfWeek,
  convertToStr,
  getEndofMonth,
  getStartofMonth,
  getStartOfWeek,
  convertUtcToStr,
} from '../../utils/dateHandler';
import { cleanObject } from '../../utils/cleanUpdateData';

import { checklist } from '../../tables/checklist';
import { itemChecklist } from '../../tables/item-checklist';
import { estadoItemChecklist } from '../../tables/estadoItemChecklist';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';
import { grupoXtrabajo } from '../../tables/grupoXtrabajo';

const getResumenMantenimientoQuery = () => {
  const result = db
    .select({
      idMantenimiento: mantenimiento.idMantenimiento,
      estado: trabajo.est,
      ubicacion: ubicacionTecnica.descripcion,
      fechaLimite: mantenimiento.fechaLimite,
      titulo: trabajo.nombre,
    })
    .from(mantenimiento)
    .innerJoin(trabajo, eq(mantenimiento.idTrabajo, trabajo.idTrabajo))
    .innerJoin(ubicacionTecnica, eq(ubicacionTecnica.idUbicacion, trabajo.idU));
  return result;
};

export const getMantenimientobyID = async (id: number) => {
  const result = await db
    .select({
      idMantenimiento: mantenimiento.idMantenimiento,
      titulo: trabajo.nombre,
      fechaCreacion: trabajo.fecha,
      fechaLimite: mantenimiento.fechaLimite,
      ubicacion: ubicacionTecnica.descripcion,
      abreviacion: ubicacionTecnica.abreviacion,
      areaEncargada: grupoDeTrabajo.nombre,
      codigoArea: grupoDeTrabajo.codigo,
      codigoVerificacion: ubicacionTecnica.codigo_Identificacion,
      estado: trabajo.est,
      tipo: mantenimiento.tipo,
      resumen: mantenimiento.resumen,
      prioridad: mantenimiento.prioridad,
      frecuencia: mantenimiento.frecuencia,
      tituloChecklist: checklist.nombre,
    })
    .from(mantenimiento)
    .innerJoin(trabajo, eq(mantenimiento.idTrabajo, trabajo.idTrabajo))
    .innerJoin(ubicacionTecnica, eq(ubicacionTecnica.idUbicacion, trabajo.idU))
    .innerJoin(grupoXtrabajo, eq(grupoXtrabajo.idT, trabajo.idTrabajo))
    .innerJoin(grupoDeTrabajo, eq(grupoDeTrabajo.id, grupoXtrabajo.idG))
    .leftJoin(checklist, eq(trabajo.idC, checklist.idChecklist))
    .where(eq(mantenimiento.idMantenimiento, id));

  if (result.length === 0) {
    return [];
  }

  return result;
};

export const getChecklistByMantenimiento = async (idMantenimiento: number) => {
  const checklistInfo = await db
    .select({
      nombreMantenimiento: trabajo.nombre,
      ubicacion: ubicacionTecnica.descripcion,
      idTrabajo: trabajo.idTrabajo,
      idChecklist: checklist.idChecklist,
    })
    .from(mantenimiento)
    .innerJoin(trabajo, eq(mantenimiento.idTrabajo, trabajo.idTrabajo))
    .innerJoin(checklist, eq(trabajo.idC, checklist.idChecklist))
    .innerJoin(ubicacionTecnica, eq(trabajo.idU, ubicacionTecnica.idUbicacion))
    .where(eq(mantenimiento.idMantenimiento, idMantenimiento));

  if (checklistInfo.length === 0) {
    return null;
  }

  const info = checklistInfo[0];

  // Ahora obtenemos los items con su estado usando el idTrabajo obtenido
  const items = await db
    .select({
      id: itemChecklist.idItemCheck,
      nombre: itemChecklist.titulo,
      descripcion: itemChecklist.descripcion,
      estado: estadoItemChecklist.estado,
    })
    .from(estadoItemChecklist)
    .innerJoin(
      itemChecklist,
      and(
        eq(estadoItemChecklist.idItemChecklist, itemChecklist.idItemCheck),
        eq(estadoItemChecklist.idChecklist, itemChecklist.idCheck)
      )
    )
    .where(eq(estadoItemChecklist.idTrabajo, info.idTrabajo));

  return {
    id: info.idChecklist,
    idTrabajo: info.idTrabajo,
    titulo: info.nombreMantenimiento,
    ubicacion: info.ubicacion,
    tareas: items as any[], // Cast necesario si el enum no machea perfecto con el tipo string de typescript en retorno directo
  };
};

export const getResumenMantenimiento = async (id: number) => {
  const baseQuery = getResumenMantenimientoQuery();

  const result = await baseQuery.where(eq(mantenimiento.idMantenimiento, id));

  return result[0];
};

export const getAllMantenimientosSemanales = async (date: string) => {
  const initialDate: Date = getStartOfWeek(date);
  const finalDate: Date = getEndOfWeek(date);

  const initialISO = convertToStr(initialDate);
  const finalISO = convertToStr(finalDate);

  const baseQuery = getResumenMantenimientoQuery();

  const result = await baseQuery.where(
    between(mantenimiento.fechaLimite, initialISO, finalISO)
  );

  return result;
};

export const getAllMantenimientosPorMes = async (date: string) => {
  const initialDate = getStartofMonth(date);
  const finalDate = getEndofMonth(date);

  const initialISO = convertToStr(initialDate);
  const finalISO = convertToStr(finalDate);

  const baseQuery = getResumenMantenimientoQuery();

  const result = await baseQuery.where(
    between(mantenimiento.fechaLimite, initialISO, finalISO)
  );

  return result;
};

export const createMantenimientoPreventivo = async (
  mantenimientodata: createMantenimiento,
  tx?: Tx
) => {
  const database = tx ?? db;
  const {
    idTrabajo,
    fechaLimite,
    prioridad,
    resumen = null,
    tipo,
    frecuencia = null,
    instancia = null,
    condicion = null,
  } = mantenimientodata;

  const result = await database
    .insert(mantenimiento)
    .values({
      idTrabajo,
      fechaLimite: convertUtcToStr(fechaLimite),
      prioridad,
      resumen,
      tipo: tipo as 'Periodico' | 'Condicion',
      frecuencia,
      instancia,
      condicion,
      fechaProximaGeneracion: mantenimientodata.fechaProximaGeneracion
        ? convertUtcToStr(mantenimientodata.fechaProximaGeneracion as Date)
        : null,
    })
    .returning();

  if (result.length === 0) {
    throw new Error('El mantenimiento no se creo correctamente');
  }

  return result[0];
};

export const updateMantenimientoPreventivo = async (
  mantenimientodata: updateMantenimiento,
  idMantenimiento: number,
  tx?: Tx
) => {
  const database = tx ?? db;

  const existingMantenimiento = await database
    .select({
      fechaLimite: mantenimiento.fechaLimite,
      idTrabajo: mantenimiento.idTrabajo,
    })
    .from(mantenimiento)
    .where(eq(mantenimiento.idMantenimiento, idMantenimiento))
    .limit(1);

  if (existingMantenimiento.length === 0) {
    throw new Error('Mantenimiento no encontrado');
  }

  const { idTrabajo, fechaLimite: currentFechaLimite } =
    existingMantenimiento[0];

  // 2. Determine Status Update Logic
  let newStatus: string | null = null;
  const newFechaLimite = mantenimientodata.fechaLimite
    ? convertUtcToStr(mantenimientodata.fechaLimite)
    : null;

  const completedItems = await database
    .select({ count: count() })
    .from(estadoItemChecklist)
    .where(
      and(
        eq(estadoItemChecklist.idTrabajo, idTrabajo),
        eq(estadoItemChecklist.estado, 'COMPLETADA')
      )
    );

  const hasProgress = completedItems[0].count > 0;

  if (hasProgress) {
    newStatus = 'En ejecución';
  } else if (newFechaLimite && newFechaLimite !== currentFechaLimite) {
    newStatus = 'Reprogramado';
  }

  // 3. Update Status if needed
  if (newStatus) {
    await database
      .update(trabajo)
      .set({ est: newStatus })
      .where(eq(trabajo.idTrabajo, idTrabajo));
  }

  const valuesToUpdate = cleanObject(mantenimientodata);

  valuesToUpdate.fechaLimite = newFechaLimite

  console.log(valuesToUpdate.fechaLimite);

  const result = await database
    .update(mantenimiento)
    .set(valuesToUpdate)
    .where(eq(mantenimiento.idMantenimiento, idMantenimiento))
    .returning();

  if (result.length === 0) {
    throw new Error('El mantenimiento no se actualizo correctamente');
  }

  return result[0];
};

export const deleteMantenimientoPreventivo = async (
  idMantenimiento: number
) => {
  const result = await db
    .delete(mantenimiento)
    .where(eq(mantenimiento.idMantenimiento, idMantenimiento))
    .returning();

  if (result.length === 0) {
    throw new Error('No se elimino correctamente el elemento');
  }

  const idTrabajo = result[0].idTrabajo;

  const deleteResult = await db
    .delete(trabajo)
    .where(eq(trabajo.idTrabajo, idTrabajo));

  if (!deleteResult) {
    throw new Error('No se elimino correctamente el trabajo');
  }

  return;
};
