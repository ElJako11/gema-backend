import { Request, Response } from 'express';
import {
  createGrupoDeTrabajo,
  getGrupoDeTrabajoById,
  getGruposDeTrabajo,
} from '../../services/gruposDeTrabajos/gruposDeTrabajo.service';
import {
  updateGrupoDeTrabajo,
  deleteGrupoDeTrabajo,
} from '../../services/gruposDeTrabajos/gruposDeTrabajo.service';

export const createGrupoDeTrabajoHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const grupoDeTrabajo = await createGrupoDeTrabajo(req.body);
    res.status(201).json({
      data: grupoDeTrabajo,
    });

    return;
  } catch (error) {
    if (error instanceof Error && error.message == 'El código del grupo de trabajo ya existe') {
      res.status(409).json({ error: error.message });
      return;
    }
    else{
      console.error('Error in createGrupoDeTrabajoHandler: ', error);
      res.status(500).json({
      error: 'Error al crear el grupo de trabajo',
    });
    return;
  }
}
};

export const getGruposDeTrabajoHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const grupos = await getGruposDeTrabajo();

    res.status(200).json({
      data: grupos,
    });
    return;
  } catch (error) {
    console.error('Error in getGruposDeTrabajoHandler: ', error);
    res.status(500).json({
      error: 'Error al obtener los grupos de trabajo',
    });
    return;
  }
};

export const getGruposDeTrabajoByIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: 'El ID debe ser un número válido.' });
      return;
    }

    const grupo = await getGrupoDeTrabajoById(id);

    if (grupo == null) {
      res.status(404).json({ message: 'Grupo de trabajo no encontrado.' });
      return;
    }
    res.status(200).json(grupo);
  } catch (error) {
    console.error('Error in getGruposDeTrabajoByIdHandler: ', error);
    res.status(500).json({
      error: 'Error al obtener los grupos de trabajo por id',
    });
    return;
  }
};

export const updateGrupoDeTrabajoHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'El id debe ser un número válido' });
      return;
    }

    const { codigo, nombre, area, supervisorId } = req.body;
    // validate that at least one field to update exists
    if (
      codigo === undefined &&
      nombre === undefined &&
      area === undefined &&
      supervisorId === undefined
    ) {
      res.status(400).json({
        error:
          'Se requiere al menos un campo (codigo, nombre, idSupervisor) para actualizar',
      });
      return;
    }

    const result = await updateGrupoDeTrabajo(id, req.body);

    if (result === null) {
      // no row was updated -> not found
      res.status(404).json({ error: 'Grupo de trabajo no encontrado' });
      return;
    }

    res.status(200).json({
      message: result.message,
      data: result.grupo,
    });
  } catch (error) {
    console.error('Error in updateGrupoDeTrabajoHandler: ', error);
    res.status(500).json({ error: 'Error al actualizar el grupo' });
  }
};

export const deleteGrupoDeTrabajoHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'El id debe ser un número válido' });
      return;
    }

    const result = await deleteGrupoDeTrabajo(id);

    if (result === null) {
      res.status(404).json({ error: 'Grupo de trabajo no encontrado' });
      return;
    }

    res.status(200).json({
      message: result.message,
      data: result.grupo,
    });
  } catch (error) {
    console.error('Error in deleteGrupoDeTrabajoHandler: ', error);
    res.status(500).json({ error: 'Error al eliminar grupo de trabajo' });
  }
};
