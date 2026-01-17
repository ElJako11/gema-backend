import { Request, Response } from 'express';
import {
  createTrabajoFacade,
  createChecklistFromTemplate,
  updateTrabajoFacade,
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
    const { idMantenimiento, idInspeccion, idPlantilla } = req.body;

    const result = await createChecklistFromTemplate(
      parseInt(idMantenimiento, 10),
      parseInt(idInspeccion, 10),
      parseInt(idPlantilla, 10)
    );

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

export const updateTrabajoFacadeHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { idMantenimiento, idInspeccion, ...data } = req.body;

    // Parse IDs from body strings if they exist
    const parsedIds = {
      idMantenimiento: idMantenimiento
        ? parseInt(idMantenimiento, 10)
        : undefined,
      idInspeccion: idInspeccion ? parseInt(idInspeccion, 10) : undefined,
    };

    const result = await updateTrabajoFacade(parsedIds, data);

    res.status(200).json({
      message: 'Trabajo actualizado exitosamente',
      data: result,
    });
  } catch (error: any) {
    console.error('Error en updateTrabajoFacadeHandler:', error);
    res.status(500).json({
      message: error.message || 'Error interno del servidor',
    });
  }
};
