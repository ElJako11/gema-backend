import { Request, Response, NextFunction } from 'express';
import {
  createTecnico,
  existeTecnico,
  getAllTecnicos,
} from '../../services/tecnico/tecnico.service';

export const createTecnicoHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if(await existeTecnico(req.body.Correo)) {
      res.status(409).json({
        error: 'El técnico con ese correo ya existe',
      });
      return;
    }
    const user = await createTecnico(req.body);
    res.status(201).json({
      data: user,
    });
    return;
  } catch (error) {
    console.error('Error in createTecnicoHandler:', error);
    res.status(500).json({
      error: 'Error al crear el tecnico',
    });
    return; // Ensure all code paths return a value
  }
};

export const getAllTecnicosHandler = async (req: Request, res: Response) => {
  try {
    const usuarios = await getAllTecnicos();
    res.status(201).json({
      data: usuarios,
    });
    return;
  } catch (error) {
    console.error('Error en getAllTecnicosHandler', error);
    return;
  }
};
