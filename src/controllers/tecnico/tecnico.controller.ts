import { Request, Response} from 'express';
import {
  createTecnico,
  existeTecnico,
  getAllTecnicos,
  getListaTecnicos,
  updateTecnico,
  deleteTecnico
} from '../../services/tecnico/tecnico.service';
import { AuthRequest } from '../../types/types';

//Get all Tecnicos
export const getAllTecnicosHandler = async (req: Request, res: Response) => {
  try {
    if(await existeTecnico(req.body.Correo)) {
      res.status(409).json({
        error: 'El técnico con ese correo ya existe',
      });
      return;
    }
    const user = await createTecnico(req.body);
    res.status(201).json({
      data: tecnicos,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tecnicos'});
  }
}

//Get lista de Tecnicos
export const getListaTecnicosHandler = async (req: Request, res: Response) => {
  try {
    const listaTecnicos = await getListaTecnicos();
    res.status(201).json({
      data: listaTecnicos,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de tecnicos'});
  }
}

//Post Tecnico
export const createTecnicoHandler = async ( req: AuthRequest, res: Response ) => {
  try {
    const tecnico = await createTecnico(req.body);
    res.status(201).json({
      tecnico
    });
    return;
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
}

//Patch Tecnico
export const updateTecnicoHandler = async ( req: AuthRequest, res: Response ) => {
  const id = parseInt(req.params.id);

  if(Object.keys(req.body).length === 0){
    res.status(400).json({ message: 'No se enviaron datos para actualizar'});
    return;
  }
  try {
    const tecnico = await updateTecnico(id, req.body);

    if(!tecnico){
      res.status(404).json({ message: 'Tecnico no encontrado para actualizar'});
      return;
    }

    res.status(201).json({
      message: 'Tecnico actualizado correctamente',
    });
  
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
}

export const deleteTecnicoHandler = async ( req: AuthRequest, res: Response ) => {
  const id = parseInt(req.params.id);

  try {
    const tecnico = await deleteTecnico(id);

    if(!tecnico){
      res.status(404).json({ message: 'Tecnico no encontrado para eliminar'});
      return;
    }

    res.status(201).json({
      message: 'Tecnico eliminado correctamente',
    });
  } catch (error) {
    res.status(500).json({message: (error as Error).message});
  }
}
