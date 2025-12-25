import { db } from '../../config/db';
import { eq, between } from 'drizzle-orm';

import { inspeccion } from '../../tables/inspeccion';
import { trabajo } from '../../tables/trabajo';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';
import { grupoXtrabajo } from '../../tables/grupoXtrabajo';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';
import { usuarios } from '../../tables/usuarios';
import { itemChecklist } from '../../tables/item-checklist';

import {
  insertInspeccion,
  putInspeccion,
  ResumenInspeccion,
} from '../../types/inspeccion';

import { cleanObject } from '../../utils/cleanUpdateData';
import {
  Add,
  convertToISOStr,
  getEndofMonth,
  getStartofMonth,
  getStartOfWeek,
} from '../../utils/dateHandler';

const getResumenQueryBase = () => {
  const baseQuery = db
    .select({
      idInspeccion: inspeccion.id,
      ubicacion: ubicacionTecnica.descripcion,
      estado: trabajo.est,
      areaEncargada: grupoDeTrabajo.area,
      supervisor: usuarios.Nombre,
      frecuencia: inspeccion.frecuencia,
    })
    .from(inspeccion)
    .innerJoin(trabajo, eq(inspeccion.idT, trabajo.idTrabajo))
    .innerJoin(ubicacionTecnica, eq(trabajo.idU, ubicacionTecnica.idUbicacion))
    .innerJoin(grupoXtrabajo, eq(trabajo.idTrabajo, grupoXtrabajo.idT))
    .innerJoin(grupoDeTrabajo, eq(grupoDeTrabajo.id, grupoXtrabajo.idG))
    .innerJoin(usuarios, eq(grupoDeTrabajo.supervisorId, usuarios.Id));

  return baseQuery;
};

export const getDetalleInspeccion = async (id: number) => {
  const result = await db
    .select({
      idInspeccion: inspeccion.id,
      fechaCreacion: trabajo.fecha,
      ubicacion: ubicacionTecnica.descripcion,
      estado: trabajo.est,
      supervisor: usuarios.Nombre,
      observacion: inspeccion.observacion,
      frecuencia: inspeccion.frecuencia,
      areaEncargada: grupoDeTrabajo.area,
      itemChecklist: itemChecklist.descripcion,
    })
    .from(inspeccion)
    .innerJoin(trabajo, eq(inspeccion.idT, trabajo.idTrabajo))
    .innerJoin(ubicacionTecnica, eq(trabajo.idU, ubicacionTecnica.idUbicacion))
    .innerJoin(grupoXtrabajo, eq(trabajo.idTrabajo, grupoXtrabajo.idT))
    .innerJoin(grupoDeTrabajo, eq(grupoDeTrabajo.id, grupoXtrabajo.idG))
    .innerJoin(usuarios, eq(grupoDeTrabajo.supervisorId, usuarios.Id))
    .innerJoin(itemChecklist, eq(itemChecklist.idCheck, trabajo.idC))
    .where(eq(inspeccion.id, id));

  const cleanArray = result.reduce((acc, row) => {
    const item = row.itemChecklist;

    if (!acc) {
      const { itemChecklist, ...datosGenerales } = row;

      acc = {
        ...datosGenerales,
        itemsChecklist: [],
      };
    }

    if (item) {
      acc.itemsChecklist.push(item);
    }

    return acc;
  }, null as any);

  return cleanArray;
};

export const getResumenInspeccion = async (id: number) => {
  const baseQuery = getResumenQueryBase();

  const result: ResumenInspeccion[] = await baseQuery.where(
    eq(inspeccion.id, id)
  );

  return result;
};

export const getInspeccionesMensuales = async (date: string) => {
  const initialDate = getStartofMonth(date);
  const finalDate = getEndofMonth(date);

  const initialISO = convertToISOStr(initialDate);
  const finalISO = convertToISOStr(finalDate);

  const baseQuery = getResumenQueryBase();

  const result = await baseQuery.where(
    between(trabajo.fecha, initialISO, finalISO)
  );

  return result;
};

export const getInspeccionesSemanales = async (date: string) => {
  const initialDate = getStartOfWeek(date);
  const finalDate = Add(new Date(date));

  const initialISO = convertToISOStr(initialDate);
  const finalISO = convertToISOStr(finalDate);

  const baseQuery = getResumenQueryBase();

  const result = await baseQuery.where(
    between(trabajo.fecha, initialISO, finalISO)
  );

  return result;
};

export const createInspeccion = async (inspeccionData: insertInspeccion) => {
  const { idTrabajo, observaciones, frecuencia } = inspeccionData;

  const result = await db
    .insert(inspeccion)
    .values({
      idT: idTrabajo,
      observacion: observaciones,
      frecuencia: frecuencia,
    })
    .returning();

  if (result.length === 0) {
    throw new Error('No se creo correctamente la inspeccion');
  }

  return result[0];
};

export const updateInspeccion = async (
  inspeccionData: putInspeccion,
  id: number
) => {
  const valuesToUpdate = cleanObject(inspeccionData);

  const result = await db
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

  return;
};
