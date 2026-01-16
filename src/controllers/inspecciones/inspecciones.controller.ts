import { Request, Response } from 'express';

import {
  getDetalleInspeccion,
  getResumenInspeccion,
  getInspeccionesMensuales,
  getInspeccionesSemanales,
  createInspeccion,
  updateInspeccion,
  deleteInspeccion,
  getTareasChecklist,
} from '../../services/inspecciones/inspecciones.service';

export const getDetalleInspeccionHandler = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await getDetalleInspeccion(id);

    if (!result) {
      res
        .status(404)
        .json({ error: 'No se encontro una inspeccion asociada a ese ID' });
      return;
    }

    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const getResumenInspeccionHandler = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await getResumenInspeccion(id);

    if (!result) {
      res
        .status(404)
        .json({ error: 'No se encontro una inspeccion asociada a ese ID' });
      return;
    }

    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const getTareasChecklistHandler = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await getTareasChecklist(id);

    if (!result) {
      res.status(404).json({
        error: 'No se encontraron tareas de checklist para esta inspeccion',
      });
      return;
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

export const getInspeccionesByFecha = async (req: Request, res: Response) => {
  const { date, filter } = req.query;

  try {
    let result = [];

    if (filter === 'mensual') {
      result = await getInspeccionesMensuales(date as string);
    } else {
      result = await getInspeccionesSemanales(date as string);
    }

    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};

export const createInspeccionHandler = async (req: Request, res: Response) => {
  try {
    const result = await createInspeccion(req.body);

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

export const updateInspeccionHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await updateInspeccion(req.body, id);

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

export const deleteInspeccionHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await deleteInspeccion(id);

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
