import { db } from '../../config/db';

import { eq } from 'drizzle-orm';

import { mantenimiento } from '../../tables/mantenimiento';
import { trabajo } from '../../tables/trabajo';

import {
  createMantenimiento,
  updateMantenimiento,
} from '../../types/mantenimiento';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';

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
};

export const getResumenMantenimiento = async (id: number) => {
  const result = await db
    .select({
      idMantenimiento: mantenimiento.idMantenimiento,
      estado: trabajo.est,
      ubicacion: ubicacionTecnica.descripcion,
      fechaLimite: mantenimiento.fechaLimite,
    })
    .from(mantenimiento)
    .innerJoin(trabajo, eq(mantenimiento.idTrabajo, trabajo.idTrabajo))
    .innerJoin(ubicacionTecnica, eq(ubicacionTecnica.idUbicacion, trabajo.idU))
    .where(eq(mantenimiento.idMantenimiento, id));

  return result[0];
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
      fechaLimite: fechaLimite.toISOString().split('T')[0],
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
  //* Convierto el objeto en un array clave-valor.
  const valuesArray = Object.entries(mantenimientodata);

  //* Le aplico un filtro para eliminar elementos undefined.
  const cleanValuesArray = valuesArray.filter(
    ([_, value]) => value !== undefined
  );

  //* Lo reconvierto en un objeto.
  const valuesToUpdate = Object.fromEntries(cleanValuesArray);

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
