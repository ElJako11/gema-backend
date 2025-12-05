import { Request, Response} from 'express';
import {
  createTecnico,
  getAllTecnicos,
  updateTecnico,
  deleteTecnico
} from '../../services/tecnico/tecnico.service';
import { AuthRequest } from '../../types/types';

export const getAllTecnicosHandler = async (req: Request, res: Response) => {
  try {
    const tecnicos = await getAllTecnicos();
    res.status(201).json({
      data: tecnicos,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los tecnicos'});
  }
}

export const createTecnicoHandler = async ( req: AuthRequest, res: Response ) => {
  try {
    const tecnico = await createTecnico(req.body);
    res.status(201).json({
      data: tecnico,
    });
    return;
  } catch (error) {
    res.status(500).json({error: 'Error al crear el tecnico'});
  }
}

export const updateTecnicoHandler = async ( req: AuthRequest, res: Response ) => {
  const id = Number(req.params.id);
  try {
    const tecnico = await updateTecnico(id, req.body);
    res.status(201).json({
      data: tecnico,
    });
    return;
  } catch (error) {
    res.status(500).json({error: 'Error al actualizar el tecnico'});
  }
}

export const deleteTecnicoHandler = async ( req: AuthRequest, res: Response ) => {
  const id = Number(req.params.id);
  try {
    const tecnico = await deleteTecnico(id);
    res.status(201).json({
      data: tecnico,
    });
    return;
  } catch (error) {
    res.status(500).json({error: 'Error al eliminar el tecnico'});
  }
}

// export const createTecnicoHandler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const user = await createTecnico(req.body);
//     res.status(201).json({
//       data: user,
//     });
//     return;
//   } catch (error) {
//     console.error('Error in createTecnicoHandler:', error);
//     res.status(500).json({
//       error: 'Error al crear el tecnico',
//     });
//     return; // Ensure all code paths return a value
//   }
// };

// export const getAllTecnicosHandler = async (req: Request, res: Response) => {
//   try {
//     const usuarios = await getAllTecnicos();
//     res.status(201).json({
//       data: usuarios,
//     });
//     return;
//   } catch (error) {
//     console.error('Error en getAllTecnicosHandler', error);
//     return;
//   }
// };
