import { Request, Response } from "express";
import { getAllChecklist, getCheclistByID, createChecklist, updateChecklist, deleteChecklistByID } from "../../services/checklist/checklist.service";    
import { AuthRequest } from "../../types/types";

//Get all Checklists
export const getChecklistHandler = async (req: AuthRequest, res: Response) => {
    try {
        const checklists = await getAllChecklist();
        res.status(200).json({ data: checklists });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener checklists' });
    }
}

//Get Checklist by ID
export const getChecklistByIDHandler = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
        const checklist = await getCheclistByID(id);

        if (!checklist) {
            res.status(404).json({ error: 'Checklist no encontrado' });
            return;
        }
        res.status(200).json({ data: checklist });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener checklist' });
    }
}

export const createChecklistHandler = async (req: AuthRequest, res: Response) => {
    try {
        const newChecklist = await createChecklist(req.body);
        res.status(201).json({ data: newChecklist });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear checklist' });
    }
}
//patch Checklist
export const updateChecklistHandler = async (req: AuthRequest, res: Response) => {
     const id = parseInt(req.params.id, 10);

     if (Object.keys(req.body).length === 0){
        res.status(400).json({ message: 'No se enviaron datos para actualizar'});
        return;
    }

    try {
        const updatedChecklist = await updateChecklist(id, req.body);
        res.status(200).json({ data: updatedChecklist });
    res.status(200).json({ data: updatedChecklist });
    } catch (error) {
        if (error instanceof Error && error.message === 'Checklist no encontrado') {
            res.status(404).json({ error: 'Checklist no encontrado' });
            return;
        }
        res.status(500).json({ error: 'Error al actualizar checklist' });
    }
}

export const deleteChecklistHandler = async(req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const deletedChecklist = await deleteChecklistByID(id);
        res.status(200).json({ message: 'Checklist eliminado correctamente' });
    } catch (error) {
        if (error instanceof Error && error.message === 'Checklist no encontrado') {
            res.status(404).json({ error: 'Checklist no encontrado' });
            return;
        }
        res.status(500).json({ error: 'Error al eliminar checklist' });
    }
}