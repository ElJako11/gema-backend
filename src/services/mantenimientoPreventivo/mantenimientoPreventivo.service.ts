import { db } from '../../config/db';

import { eq, between, sql } from 'drizzle-orm';

import { mantenimiento } from '../../tables/mantenimiento';
import { trabajo } from '../../tables/trabajo';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';

import {
  createMantenimiento,
  updateMantenimiento,
} from '../../types/mantenimiento';

import {
  Add,
  convertToISOStr,
  getEndofMonth,
  getStartofMonth,
  getStartOfWeek,
} from '../../utils/dateHandler';
import { cleanObject } from '../../utils/cleanUpdateData';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';
import { grupoXtrabajo } from '../../tables/grupoXtrabajo';

const getResumenMantenimientoQuery = () => {
  const result = db
    .select({
      idMantenimiento: mantenimiento.idMantenimiento,
      estado: trabajo.est,
      ubicacion: ubicacionTecnica.descripcion,
      fechaLimite: mantenimiento.fechaLimite,
    })
    .from(mantenimiento)
    .innerJoin(trabajo, eq(mantenimiento.idTrabajo, trabajo.idTrabajo))
    .innerJoin(ubicacionTecnica, eq(ubicacionTecnica.idUbicacion, trabajo.idU));
  return result;
};

export const getAllMantenimiento = async () => {
  const result = await db
    .select({
      idMantenimiento: mantenimiento.idMantenimiento,
      fechaCreacion: trabajo.fecha,
      fechaLimite: mantenimiento.fechaLimite,
      ubicacion: ubicacionTecnica.descripcion,
      estado: trabajo.est,
      tipo: mantenimiento.tipo,
      resumen: mantenimiento.resumen,
      prioridad: mantenimiento.prioridad,
      areaEncargada: grupoDeTrabajo.area,
    })
    .from(mantenimiento)
    .innerJoin(trabajo, eq(mantenimiento.idTrabajo, trabajo.idTrabajo))
    .innerJoin(ubicacionTecnica, eq(ubicacionTecnica.idUbicacion, trabajo.idU))
    .innerJoin(grupoXtrabajo, eq(grupoXtrabajo.idT, trabajo.idTrabajo))
    .innerJoin(grupoDeTrabajo, eq(grupoDeTrabajo.id, grupoXtrabajo.idG));

  return result;
};

/*
export const getMantenimientobyID = async (id: number) => {
  const result = await db
    .select({
      idMantenimiento: mantenimiento.idMantenimiento,
      fechaCreacion: trabajo.fecha,
      fechaLimite: mantenimiento.fechaLimite,
      ubicacion: ubicacionTecnica.descripcion,
      estado: trabajo.est,
      tipo: mantenimiento.tipo,
      resumen: mantenimiento.resumen,
      prioridad: mantenimiento.prioridad,
    })
    .from(mantenimiento)
    .innerJoin(trabajo, eq(mantenimiento.idTrabajo, trabajo.idTrabajo))
    .innerJoin(ubicacionTecnica, eq(ubicacionTecnica.idUbicacion, trabajo.idU))
    .where(eq(mantenimiento.idMantenimiento, id));

  if (result.length === 0) {
    return [];
  }

  return result;
};*/

export const getResumenMantenimiento = async (id: number) => {
  const baseQuery = getResumenMantenimientoQuery();

  const result = await baseQuery.where(eq(mantenimiento.idMantenimiento, id));

  return result[0];
};

export const getAllMantenimientosSemanales = async (date: string) => {
  const initialDate: Date = getStartOfWeek(date);
  const finalDate: Date = Add(initialDate);

  const initialISO = convertToISOStr(initialDate);
  const finalISO = convertToISOStr(finalDate);

  const baseQuery = getResumenMantenimientoQuery();

  const result = await baseQuery.where(
    between(mantenimiento.fechaLimite, initialISO, finalISO)
  );

  return result;
};

export const getAllMantenimientosPorMes = async (date: string) => {
  const initialDate = getStartofMonth(date);
  const finalDate = getEndofMonth(date);

  const initialISO = convertToISOStr(initialDate);
  const finalISO = convertToISOStr(finalDate);

  const baseQuery = getResumenMantenimientoQuery();

  const result = await baseQuery.where(
    between(mantenimiento.fechaLimite, initialISO, finalISO)
  );

  return result;
};

export const createMantenimientoPreventivo = async (
  mantenimientodata: createMantenimiento
) => {
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

  const result = await db
    .insert(mantenimiento)
    .values({
      idTrabajo,
      fechaLimite: convertToISOStr(fechaLimite),
      prioridad,
      resumen,
      tipo: tipo as 'Periodico' | 'Condicion',
      frecuencia,
      instancia,
      condicion,
    })
    .returning();

  if (result.length === 0) {
    throw new Error('El mantenimiento no se creo correctamente');
  }

  return result[0];
};

export const updateMantenimientoPreventivo = async (
  mantenimientodata: updateMantenimiento,
  idMantenimiento: number
) => {
  const valuesToUpdate = cleanObject(mantenimientodata);

  const result = await db
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

  return;
};
