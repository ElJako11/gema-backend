import { Request, Response } from 'express';
import { CreateWorkInput } from '../../validations/workCreationSchema';
import { createTrabajoFacade } from '../../services/facades/trabajoFacade.service';

export const createTrabajoFacadeHandler = async (req: Request, res: Response) => {
  try {
    const validatedData = req.body as CreateWorkInput;

    const result = await createTrabajoFacade(validatedData);

    res.status(201).json({
      message: 'Trabajo creado exitosamente',
      data: result,
    });
  } catch (error: any) {
    console.error('Error en createWorkHandler:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
    });
  }
};
