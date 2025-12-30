import {
  getAllMantenimientosPorMes,
  getAllMantenimientosSemanales,
} from '../mantenimientoPreventivo/mantenimientoPreventivo.service';

import {
  getInspeccionesMensuales,
  getInspeccionesSemanales,
} from '../inspecciones/inspecciones.service';

export const getAllEventosMensuales = async (date: string) => {
  const [InspeccionesResult, MantenimientosResult] = await Promise.all([
    getInspeccionesMensuales(date),
    getAllMantenimientosPorMes(date),
  ]);

  if (!InspeccionesResult || !MantenimientosResult) {
    throw new Error('No se pudo obtener toda la informacion requerida');
  }

  console.log(InspeccionesResult);
  console.log(MantenimientosResult);

  return {
    inspecciones: [...InspeccionesResult],
    mantenimientos: [...MantenimientosResult],
  };
};

export const getAllEventosSemanales = async (date: string) => {
  const [InspeccionesResult, MantenimientosResult] = await Promise.all([
    getInspeccionesSemanales(date),
    getAllMantenimientosSemanales(date),
  ]);

  if (!InspeccionesResult || !MantenimientosResult) {
    throw new Error('No se pudo obtener toda la informacion requerida');
  }

  return {
    inspecciones: [...InspeccionesResult],
    mantenimientos: [...MantenimientosResult],
  };
};
