import { Request, Response } from 'express';

export const getAllEventosByFechaHandler = (req: Request, res: Response) => {
  const { date } = req.query;

  if (!date) {
    res
      .status(400)
      .json({ error: 'Se requiere la fecha para realizar la busqueda' });
    return;
  }
};
