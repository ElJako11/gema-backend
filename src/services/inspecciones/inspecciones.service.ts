import { db } from '../../config/db';
import { eq, between } from 'drizzle-orm';

import { inspeccion } from '../../tables/inspeccion';
import { trabajo } from '../../tables/trabajo';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';
import { grupoXtrabajo } from '../../tables/grupoXtrabajo';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';
import { usuarios } from '../../tables/usuarios';
import { itemChecklist } from '../../tables/item-checklist';
import { checklist } from '../../tables/checklist';
import { estadoItemChecklist } from '../../tables/estadoItemChecklist';

import {
  insertInspeccion,
  putInspeccion,
  ResumenInspeccion,
  Checklist,
} from '../../types/inspeccion';
import { Tx } from '../../types/transaction';

import { cleanObject } from '../../utils/cleanUpdateData';
import {
  getEndOfWeek,
  convertToStr,
  getEndofMonth,
  getStartofMonth,
  getStartOfWeek,
} from '../../utils/dateHandler';
import { id } from 'zod/v4/locales';

const getResumenQueryBase = () => {
  const baseQuery = db
    .select({
      idInspeccion: inspeccion.id,
      fechaCreacion: trabajo.fecha,
      ubicacion: ubicacionTecnica.descripcion,
      estado: trabajo.est,
      areaEncargada: grupoDeTrabajo.area,
      supervisor: usuarios.Nombre,
      frecuencia: inspeccion.frecuencia,
      titulo: trabajo.nombre,
    })
    .from(inspeccion)
    .innerJoin(trabajo, eq(inspeccion.idT, trabajo.idTrabajo))
    .innerJoin(ubicacionTecnica, eq(trabajo.idU, ubicacionTecnica.idUbicacion))
    .innerJoin(grupoXtrabajo, eq(trabajo.idTrabajo, grupoXtrabajo.idT))
    .innerJoin(grupoDeTrabajo, eq(grupoDeTrabajo.id, grupoXtrabajo.idG))
    .leftJoin(usuarios, eq(grupoDeTrabajo.supervisorId, usuarios.Id));

  return baseQuery;
};

export const getDetalleInspeccion = async (id: number) => {
  const result = await db
    .select({
      idInspeccion: inspeccion.id,
      titulo: trabajo.nombre,
      fechaCreacion: trabajo.fecha,
      ubicacion: ubicacionTecnica.descripcion,
      abreviacion: ubicacionTecnica.abreviacion,
      codigoVerificacion: ubicacionTecnica.codigo_Identificacion,
      estado: trabajo.est,
      supervisor: usuarios.Nombre,
      observacion: inspeccion.observacion,
      frecuencia: inspeccion.frecuencia,
      areaEncargada: grupoDeTrabajo.area,
      codigoArea: grupoDeTrabajo.codigo,
      checklist: checklist.nombre,
    })
    .from(inspeccion)
    .innerJoin(trabajo, eq(inspeccion.idT, trabajo.idTrabajo))
    .innerJoin(ubicacionTecnica, eq(trabajo.idU, ubicacionTecnica.idUbicacion))
    .innerJoin(grupoXtrabajo, eq(trabajo.idTrabajo, grupoXtrabajo.idT))
    .innerJoin(grupoDeTrabajo, eq(grupoDeTrabajo.id, grupoXtrabajo.idG))
    .leftJoin(usuarios, eq(grupoDeTrabajo.supervisorId, usuarios.Id))
    .leftJoin(checklist, eq(checklist.idChecklist, trabajo.idC))
    .where(eq(inspeccion.id, id));

  return result[0];
};

export const getResumenInspeccion = async (id: number) => {
  const baseQuery = getResumenQueryBase();

  const result: ResumenInspeccion[] = await baseQuery.where(
    eq(inspeccion.id, id)
  );

  return result[0];
};

export const getInspeccionesMensuales = async (date: string) => {
  const initialDate = getStartofMonth(date);
  const finalDate = getEndofMonth(date);

  const initialISO = convertToStr(initialDate);
  const finalISO = convertToStr(finalDate);

  const baseQuery = getResumenQueryBase();

  const result = await baseQuery.where(
    between(trabajo.fecha, initialISO, finalISO)
  );

  return result;
};

export const getInspeccionesSemanales = async (date: string) => {
  const initialDate = getStartOfWeek(date);
  const finalDate = getEndOfWeek(date);

  const initialISO = convertToStr(initialDate);
  const finalISO = convertToStr(finalDate);

  const baseQuery = getResumenQueryBase();

  const result = await baseQuery.where(
    between(trabajo.fecha, initialISO, finalISO)
  );

  return result;
};

export const getTareasChecklist = async (idInspeccion: number) => {
  try {
    const infoChecklist = await db
      .select({
        idChecklist: checklist.idChecklist,
        idTrabajo: inspeccion.idT,
        nombreInspeccion: trabajo.nombre,
        ubicacion: ubicacionTecnica.descripcion,
        idTarea: itemChecklist.idItemCheck,
        nombreTarea: itemChecklist.titulo,
        descripcionTarea: itemChecklist.descripcion,
        estado: estadoItemChecklist.estado,
      })
      .from(inspeccion)
      .innerJoin(trabajo, eq(inspeccion.idT, trabajo.idTrabajo))
      .innerJoin(
        ubicacionTecnica,
        eq(trabajo.idU, ubicacionTecnica.idUbicacion)
      )
      .innerJoin(checklist, eq(trabajo.idC, checklist.idChecklist))
      .leftJoin(
        estadoItemChecklist,
        eq(trabajo.idTrabajo, estadoItemChecklist.idTrabajo)
      )
      .leftJoin(
        itemChecklist,
        eq(estadoItemChecklist.idItemChecklist, itemChecklist.idItemCheck)
      )
      .where(eq(inspeccion.id, idInspeccion));

    if (infoChecklist.length === 0) {
      throw new Error('No se encontro una inspeccion asociada a ese ID');
    }

    // Grouping results
    const firstRow = infoChecklist[0];
    const tasks = infoChecklist
      .filter(row => row.idTarea !== null)
      .map(row => ({
        id: row.idTarea!,
        nombre: row.nombreTarea!,
        descripcion: row.descripcionTarea!,
        estado: row.estado as 'COMPLETADA' | 'PENDIENTE',
      }));

    const response: Checklist = {
      id: firstRow.idChecklist,
      idTrabajo: firstRow.idTrabajo,
      titulo: firstRow.nombreInspeccion,
      ubicacion: firstRow.ubicacion,
      tareas: tasks,
    };

    return response;
  } catch (error) {
    console.error('Error en getTareasChecklist:', error);
    throw error;
  }
};

export const createInspeccion = async (
  inspeccionData: insertInspeccion,
  tx?: Tx
) => {
  const database = tx ?? db;
  const { idTrabajo, observaciones, frecuencia } = inspeccionData;

  const result = await database
    .insert(inspeccion)
    .values({
      idT: idTrabajo,
      observacion: observaciones,
      frecuencia: frecuencia,
      fechaProximaGeneracion: inspeccionData.fechaProximaGeneracion
        ? convertToStr(inspeccionData.fechaProximaGeneracion as Date)
        : null,
    })
    .returning();

  if (result.length === 0) {
    throw new Error('No se creo correctamente la inspeccion');
  }

  return result[0];
};

export const updateInspeccion = async (
  inspeccionData: putInspeccion,
  id: number,
  tx?: Tx
) => {
  const database = tx ?? db;
  const valuesToUpdate = cleanObject(inspeccionData);

  const result = await database
    .update(inspeccion)
    .set(valuesToUpdate)
    .where(eq(inspeccion.id, id))
    .returning();

  if (result.length === 0) {
    throw new Error('La inspeccion no se actualizo correctamente');
  }

  return result[0];
};

export const deleteInspeccion = async (id: number) => {
  const result = await db
    .delete(inspeccion)
    .where(eq(inspeccion.id, id))
    .returning();

  if (result.length === 0) {
    throw new Error('El elemento no se elimino correctamente');
  }

  const idTrabajo = result[0].idT;

  const deleteResult = await db
    .delete(inspeccion)
    .where(eq(inspeccion.idT, idTrabajo));

  if (!deleteResult) {
    throw new Error('No se elimino correctamente el trabajo');
  }

  return;
};
