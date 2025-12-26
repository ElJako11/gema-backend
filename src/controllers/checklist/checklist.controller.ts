import { Request, Response } from "express";
import { getAllChecklist, createChecklist, updateChecklist, deleteChecklistByID, getChecklistWithItems } from "../../services/checklist/checklist.service";    
import { AuthRequest } from "../../types/types";

export const getChecklistWithItemsHandler = async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const checklistWithItems = await getChecklistWithItems(id);
        res.status(200).json({ data: checklistWithItems });
    } catch (error: any) {
        if (error.message === 'Checklist no encontrado') {
            res.status(404).json({ error: 'Checklist no encontrado' });
            return;
        }
        res.status(500).json({ error: 'Error al obtener checklist con items' });
    }
}

export const getChecklistHandler = async (req: AuthRequest, res: Response) => {
    try {
        const checklists = await getAllChecklist();
        res.status(200).json({ data: checklists });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener checklists' });
    }
}

export const postChecklistHandler = async (req: AuthRequest, res: Response) => {
    try {
        const newChecklist = await createChecklist(req.body);
        res.status(201).json({ data: newChecklist });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear checklist' });
    }
}

export const putChecklistHandler = async (req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const updatedChecklist = await updateChecklist(id, req.body);
        if (!updatedChecklist) {
            res.status(404).json({ error: 'Checklist no encontrado' });
            return;
        }
        res.status(200).json({ data: updatedChecklist });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar checklist' });
    }
}

export const deleteChecklistHandler = async(req: AuthRequest, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const deletedChecklist = await deleteChecklistByID(id);
        if (!deletedChecklist) {
            res.status(404).json({ error: 'Checklist no encontrado' });
            return;
        }   
        res.status(200).json({ message: 'Checklist eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar checklist' });
    }
}