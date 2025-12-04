import {Request, Response} from 'express';
import {getAllTrabajos, getTrabajoById, createTrabajo, updateTrabajo, deleteTrabajo} from '../../services/trabajo/trabajo.service';
import { AuthRequest } from '../../types/types';

//Get Trabajos
export const getTrabajosHandler = async (req: Request, res: Response) => {
    try{ 
        const trabajos = await getAllTrabajos();
        res.status(200).json(trabajos);
    }catch(error){
        res.status(500).json({message: (error as Error).message});
    }
}

//Get Trabajo by ID
export const getTrabajoByIdHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try{
        const trabajo = await getTrabajoById(id);
        res.status(200).json(trabajo);
    }
    catch(error){
        res.status(500).json({message: (error as Error).message});
    }
}

//Post Trabajo
export const createTrabajoHandler = async (req: AuthRequest, res: Response) => {
    try{
        const newTrabajo = await createTrabajo(req.body);
        res.status(201).json(newTrabajo);
    }catch(error){
        res.status(500).json({message: (error as Error).message});
    }
}
//Put Trabajo
export const updateTrabajoHandler = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    try{
        await updateTrabajo(id, req.body);
        res.status(200).json({message: 'Trabajo actualizado correctamente'});
    }catch(error){
        res.status(500).json({message: (error as Error).message});
    }
}

//Delete Trabajo
export const deleteTrabajoHandler = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);
    try{
        await deleteTrabajo(id);
        res.status(200).json({message: 'Trabajo eliminado correctamente'});
    }catch(error){
        res.status(500).json({message: (error as Error).message});
    }
}