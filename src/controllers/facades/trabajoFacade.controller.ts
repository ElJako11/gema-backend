import { Request, Response } from 'express';
import {
  createTrabajoFacade,
  createChecklistFromTemplate,
} from '../../services/facades/trabajoFacade.service';

export const createTrabajoFacadeHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = req.body;

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

export const createChecklistFromTemplateHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { idTrabajo, idPlantilla } = req.body;

    const result = await createChecklistFromTemplate(idTrabajo, idPlantilla);

    res.status(201).json({
      message: 'Checklist creada desde plantilla exitosamente',
      data: result,
    });
  } catch (error: any) {
    console.error('Error en createChecklistFromTemplateHandler:', error);
    res.status(500).json({
      message: error.message || 'Error interno del servidor',
    });
  }
};
