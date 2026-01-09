import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { mantenimiento_inspeccion } from '../../tables/mantenimiento-inspeccion';
import { createMantenimientoXInspeccionParams } from '../../types/mantenimientoXinspeccion';
import { inspeccion } from '../../tables/inspeccion';
import { ubicacionTecnica } from '../../tables/ubicacionTecnica';
import { trabajo } from '../../tables/trabajo';

//Get MantenimientosXInspeccion
export const getAllMantenimientosXInspeccion = async () => {
  try {
    const mantenimientosXInspeccion = await db
      .select()
      .from(mantenimiento_inspeccion);
    return mantenimientosXInspeccion;
  } catch (error) {
    console.error('Error al obtener los MantenimientosXInspeccion', error);
    throw new Error('No se pudieron obtener los MantenimientosXInspeccion');
  }
};

//getMantenimientoXInspeccion by ID
export const getMantenimientoXInspeccionById = async (id: number) => {
  try {
    const mantenimientoXInspeccionById = await db
      .select()
      .from(mantenimiento_inspeccion)
      .where(eq(mantenimiento_inspeccion.idMantenimiento, id));
    return mantenimientoXInspeccionById[0] || null;
  } catch (error) {
    console.error('Error al obtener el MantenimientoXInspeccion por ID', error);
    throw new Error('No se pudo obtener el MantenimientoXInspeccion por ID');
  }
};

//get mantXinsp para resumen
export const getMantXInspResumen = async () => {
  try {
    const mantXInspResumen = await db
      .select({
        idMantenimiento: mantenimiento_inspeccion.idMantenimiento,
        nombre: mantenimiento_inspeccion.nombre,
        uTabreviacion: ubicacionTecnica.abreviacion,
        uTDescripcion: ubicacionTecnica.descripcion,
        trabajo: trabajo.nombre,
        inspeccionObservacion: inspeccion.observacion,
      })
      .from(mantenimiento_inspeccion)
      .leftJoin(
        inspeccion,
        eq(mantenimiento_inspeccion.idInspeccion, inspeccion.id)
      )
      .innerJoin(trabajo, eq(inspeccion.idT, trabajo.idTrabajo))
      .innerJoin(
        ubicacionTecnica,
        eq(trabajo.idU, ubicacionTecnica.idUbicacion)
      );
    return mantXInspResumen;
  } catch (error) {
    console.error(
      'Error al obtener el MantenimientoXInspeccion para resumen',
      error
    );
    throw new Error(
      'No se pudo obtener el MantenimientoXInspeccion para resumen'
    );
  }
};

//Post MantenimientoXInspeccion
export const createMantenimientoXInspeccion = async (
  params: createMantenimientoXInspeccionParams
) => {
  try {
    const newMantenimientoXInspeccion = await db
      .insert(mantenimiento_inspeccion)
      .values(params)
      .returning();
    return newMantenimientoXInspeccion[0] || null;
  } catch (error) {
    console.error('Error al crear el MantenimientoXInspeccion', error);
    throw new Error('No se pudo crear el MantenimientoXInspeccion');
  }
};

//Patch MantenimientoXInspeccion
export const updateMantenimientoXInspeccion = async (
  id: number,
  params: Partial<createMantenimientoXInspeccionParams>
) => {
  if (Object.keys(params).length === 0) {
    throw new Error('No se proporcionaron parámetros para actualizar');
  }
  try {
    const updatedMantenimientoXInspeccion = await db
      .update(mantenimiento_inspeccion)
      .set(params)
      .where(eq(mantenimiento_inspeccion.idMantenimiento, id))
      .returning();

    return updatedMantenimientoXInspeccion[0] || null;
  } catch (error) {
    console.error('Error al actualizar el MantenimientoXInspeccion', error);
    throw new Error('No se pudo actualizar el MantenimientoXInspeccion');
  }
};

//Delete MantenimientoXInspeccion
export const deleteMantenimientoXInspeccion = async (id: number) => {
  try {
    const deleted = await db
      .delete(mantenimiento_inspeccion)
      .where(eq(mantenimiento_inspeccion.idMantenimiento, id))
      .returning();

    return deleted[0] || null;
  } catch (error) {
    console.error('Error al eliminar el MantenimientoXInspeccion', error);
    throw new Error('No se pudo eliminar el MantenimientoXInspeccion');
  }
};
