import { Request, Response } from 'express';
import {
  createMantenimientoPreventivo,
  deleteMantenimientoPreventivo,
  getResumenMantenimiento,
  updateMantenimientoPreventivo,
  getAllMantenimientosSemanales,
  getAllMantenimientosPorMes,
  getChecklistByMantenimiento,
  getMantenimientobyID,
} from '../../services/mantenimientoPreventivo/mantenimientoPreventivo.service';

import { ResumenMantenimiento } from '../../types/mantenimiento';

export const getResumenMantenimientoHandler = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await getResumenMantenimiento(id);

    if (!result) {
      res
        .status(404)
        .json({ error: 'No se encontro un mantenimiento asociado a ese ID' });
    }

    res.status(200).json(result);
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const getMantenimientobyIDHandler = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await getMantenimientobyID(id);

    if (result.length === 0) {
      res
        .status(404)
        .json({ error: 'No se encontro un mantenimiento asociado a ese ID' });
      return;
    }

    res.status(200).json(result[0]);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const getChecklistByMantenimientoHandler = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await getChecklistByMantenimiento(id);
    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const getAllMantenimientoByFechaHandler = async (
  req: Request,
  res: Response
) => {
  const { date, filter } = req.query;

  if (!date) {
    res.status(400).json({ error: '' });
    return;
  }

  if (!filter || filter.length === 0) {
    res.status(400).json({ error: 'El filtro recibido es invalido' });
    return;
  }

  let result: ResumenMantenimiento[];

  try {
    if (filter === 'mensual') {
      result = await getAllMantenimientosPorMes(date as string);
    } else {
      result = await getAllMantenimientosSemanales(date as string);
    }

    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const postMantenimientoHandler = async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).json({ error: 'Datos incompletos' });
    return;
  }

  try {
    const result = await createMantenimientoPreventivo(req.body);

    res.status(201).json(result);
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const patchMantenimientoHandler = async (
  req: Request,
  res: Response
) => {
  if (!req.body) {
    res.status(400).json({ error: 'Datos incompletos' });
    return;
  }

  const id = parseInt(req.params.id, 10);

  try {
    const result = await updateMantenimientoPreventivo(req.body, id);

    res.status(200).json(result);
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const deleteMantenimientoHandler = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id, 10);

  try {
    await deleteMantenimientoPreventivo(id);

    res.status(204).json({ message: 'Elemento eliminado correctamente' });
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};
