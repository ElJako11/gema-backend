import { Request, Response } from 'express';
import {
  getAllEventosMensuales,
  getAllEventosSemanales,
} from '../../services/calendario/calendario.service';

export const getAllEventosByFechaHandler = async (
  req: Request,
  res: Response
) => {
  const { date, filter } = req.query;

  if (!date) {
    res
      .status(400)
      .json({ error: 'Se requiere la fecha para realizar la busqueda' });
    return;
  }

  let result = {};

  try {
    if (filter === 'mensual') {
      result = await getAllEventosMensuales(date as string);
    } else {
      result = await getAllEventosSemanales(date as string);
    }

    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }
};
