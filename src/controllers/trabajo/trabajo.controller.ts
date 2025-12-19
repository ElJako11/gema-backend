import {Request, Response} from 'express';
import {getAllTrabajos, getTrabajoById, createTrabajo, updateTrabajo, deleteTrabajo, getCantidadMantenimientosReabiertos, getMantenimientosReabiertosPorArea} from '../../services/trabajo/trabajo.service';
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

export const getMantenimientosReabiertosPorAreaHandler = async (req: Request, res: Response) => {
    try {
        const reporte = await getMantenimientosReabiertosPorArea();
        res.status(200).json(reporte);
    } catch (error) {
        res.status(500).json({message: (error as Error).message});
    }
}

export const getCantidadMantenimientosReabiertosHandler = async (req: Request, res: Response) => {
    try {
        const cantidad = await getCantidadMantenimientosReabiertos();
        res.status(200).json(cantidad);
    } catch (error) {
        res.status(500).json({message: (error as Error).message});
    }
}

//Get Trabajo by ID
export const getTrabajoByIdHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try{
        const trabajo = await getTrabajoById(id);

        if (!trabajo){
            res.status(404).json({messsage: 'Trabajo no encontrado'});
            return;
        }

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

//Patch Trabajo
export const updateTrabajoHandler = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (Object.keys(req.body).length === 0){
        res.status(400).json({ message: 'No se enviaron datos para actualizar'});
        return;
    }

    try{
        const updatedTrabajo = await updateTrabajo(id, req.body);

        if (!updatedTrabajo){
            res.status(404).json({ message: 'Trabajo no encontrado para actualizar'})
            return
        }

        res.status(200).json({message: 'Trabajo actualizado correctamente'});
    }catch(error){
        res.status(500).json({message: (error as Error).message});
    }
}

//Delete Trabajo
export const deleteTrabajoHandler = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ message: 'ID inválido' });
        return;
    }
    
    try{
        const deletedTrabajo = await deleteTrabajo(id);

        if(!deletedTrabajo){
            res.status(404).json({ message: 'Trabajo no encontrado para eliminar'})
            return;
        }

        res.status(200).json({message: 'Trabajo eliminado correctamente'});
    }catch(error){
        res.status(500).json({message: (error as Error).message});
    }
}