import {eq, and, between, sql, inArray} from 'drizzle-orm';
import {db} from '../../config/db';
import {trabajo} from '../../tables/trabajo';
import {CreateTrabajoParams} from '../../types/trabajo';
import {ubicacionTecnica} from '../../tables/ubicacionTecnica';
import {grupoDeTrabajo} from '../../tables/grupoDeTrabajo';
import {grupoXtrabajo} from '../../tables/grupoXtrabajo';
import {
  convertToISOStr,
  getEndofMonth,
  getStartofMonth,
} from '../../utils/dateHandler';

//Get Trabajos
export const getAllTrabajos = async () => {
    try{
         const trabajos = await db.select().from(trabajo);
         return trabajos;
    }catch(error){
        console.error('Error al obtener los Trabajos', error);
        throw new Error('No se pudieron obtener los Trabajos');
    }
}

//getTrabajo by ID
export const getTrabajoById = async (id: number) => {
    try{
         const trabajoById = await db.select().from(trabajo).where(eq(trabajo.idTrabajo, id));

         return trabajoById[0] || null;
    }
    catch(error){
        console.error('Error al obtener el Trabajo por ID', error);
        throw new Error('No se pudo obtener el Trabajo por ID');
    }
}

//Post Trabajo
export const createTrabajo = async (params: CreateTrabajoParams) => {
    try {
        const newTrabajo = await db.insert(trabajo)
        .values(params)
        .returning();

        return newTrabajo[0] || null;
    } catch (error) {
        console.error('Error al crear el Trabajo', error);
        throw new Error('No se pudo crear el Trabajo');
    }
}

//Patch Trabajo
export const updateTrabajo = async (id: number, params: Partial<CreateTrabajoParams>) => {
    if (Object.keys(params).length === 0) {
        return null; // No hay campos para actualizar
    }
    
    try{
        const updated = await db.update(trabajo)
        .set(params)
        .where(eq(trabajo.idTrabajo, id))
        .returning()

        return updated[0] || null;
    }catch(error){
        console.error(
            `Error al actualizar trabajo con ID ${id}`,
            error
        )
        throw new Error('Error al actualizar Trabajo');
    }
}

//Delete Trabajo
export const deleteTrabajo = async (id: number) => {
    try{
        const deleted = await db.delete(trabajo)
        .where(eq(trabajo.idTrabajo, id))
        .returning();

        return deleted[0] || null;
    }catch(error){
        console.error(
            `Error al eliminar trabajo con ID ${id}`, error
        )
        throw new Error('Error al eliminar Trabajo');
    }   
}

export const getCantidadMantenimientosReabiertos = async (): Promise<number> => {
  // Obtenemos la fecha actual para calcular el rango del mes
  const now = new Date().toISOString();
  const initialDate = getStartofMonth(now);
  const finalDate = getEndofMonth(now);

  const initialISO = convertToISOStr(initialDate);
  const finalISO = convertToISOStr(finalDate);

  // TODO: Verifica si 'Reabierto' es el valor exacto en tu base de datos para este estado
  const ESTADO_REABIERTO = 'Reabierto';

  // TODO: Asumo que existe una columna 'tipo' para diferenciar mantenimientos. Verifica el nombre y el valor.
  const TIPO_MANTENIMIENTO = 'Mantenimiento';

  const result = await db
    .select({
      count: sql<number>`cast(count(${trabajo.idTrabajo}) as int)`,
    })
    .from(trabajo)
    .where(
      and(
        between(trabajo.fecha, initialISO, finalISO),
        eq(trabajo.est, ESTADO_REABIERTO),
        eq(trabajo.tipo, TIPO_MANTENIMIENTO)
      )
    );
    console.log('Resultado de la consulta:', result);
    console.log('Cantidad de mantenimientos reabiertos:', result[0].count);
  return result[0].count;
};

export const getMantenimientosReabiertosPorArea = async () => {
  const ESTADO_REABIERTO = 'Reabierto';
  const TIPO_MANTENIMIENTO = 'Mantenimiento';

  try {
    const result = await db
      .select({
        grupo: ubicacionTecnica.descripcion, // Asumimos que 'nombre' es el campo del área en ubicacionTecnica
        total: sql<number>`cast(count(${trabajo.idTrabajo}) as int)`,
      })
      .from(trabajo)
      .innerJoin(ubicacionTecnica, eq(trabajo.idU, ubicacionTecnica.idUbicacion))
      .where(
        and(eq(trabajo.est, ESTADO_REABIERTO), eq(trabajo.tipo, TIPO_MANTENIMIENTO))
      )
      .groupBy(ubicacionTecnica.descripcion);

    return result;
  } catch (error) {
    console.error('Error al obtener mantenimientos por área', error);
    throw new Error('No se pudo obtener el reporte por área');
  }
};

export const getResumenMantenimientosMes = async () => {
  const now = new Date().toISOString();
  const initialDate = getStartofMonth(now);
  const finalDate = getEndofMonth(now);

  const initialISO = convertToISOStr(initialDate);
  const finalISO = convertToISOStr(finalDate);

  // TODO: Verifica si 'Finalizado' es el valor exacto en tu DB.
  const ESTADO_FINALIZADO = 'Completado';
  const TIPO_MANTENIMIENTO = 'Mantenimiento';

  try {
    // 1. Obtener total de mantenimientos del mes
    const totalResult = await db
      .select({
        count: sql<number>`cast(count(${trabajo.idTrabajo}) as int)`,
      })
      .from(trabajo)
      .where(
        and(
          between(trabajo.fecha, initialISO, finalISO),
          eq(trabajo.tipo, TIPO_MANTENIMIENTO)
        )
      );

    // 2. Obtener mantenimientos finalizados del mes
    const finalizadosResult = await db
      .select({
        count: sql<number>`cast(count(${trabajo.idTrabajo}) as int)`,
      })
      .from(trabajo)
      .where(
        and(
          between(trabajo.fecha, initialISO, finalISO),
          eq(trabajo.tipo, TIPO_MANTENIMIENTO),
          eq(trabajo.est, ESTADO_FINALIZADO)
        )
      );

    const total = totalResult[0].count;
    const finalizados = finalizadosResult[0].count;
    const porcentaje = total > 0 ? (finalizados / total) * 100 : 0;

    return {
      totalMantenimientos: total,
      completados: finalizados,
      porcentajeCompletados: Number(porcentaje.toFixed(2)),
    };
  } catch (error) {
    console.error('Error al obtener resumen de mantenimientos', error);
    throw new Error('No se pudo obtener el resumen del mes');
  }
};

export const getMantenimientosActivosPorArea = async () => {
  const ESTADOS_ACTIVOS = ['Reabierto', 'En Proceso', 'Asignado'];
  const TIPO_MANTENIMIENTO = 'Mantenimiento';

  try {
    const result = await db
      .select({
        grupo: grupoDeTrabajo.nombre,
        total: sql<number>`cast(count(${trabajo.idTrabajo}) as int)`,
      })
      .from(trabajo)
      .innerJoin(grupoXtrabajo, eq(trabajo.idTrabajo, grupoXtrabajo.idT))
      .innerJoin(grupoDeTrabajo, eq(grupoXtrabajo.idG, grupoDeTrabajo.id))
      .where(
        and(inArray(trabajo.est, ESTADOS_ACTIVOS), eq(trabajo.tipo, TIPO_MANTENIMIENTO))
      )
      .groupBy(grupoDeTrabajo.nombre);
    return result;
  } catch (error) {
    console.error('Error al obtener mantenimientos activos por área', error);
    throw new Error('No se pudo obtener el reporte de activos por área');
  }
};