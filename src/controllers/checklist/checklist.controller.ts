import { Request, Response } from "express";
import { getAllChecklist, createChecklist, updateChecklist, deleteChecklistByID } from "../../services/checklist/checklist.service";    

export const getChecklistHandler = async (req: Request, res: Response) => {
    try {
        const checklists = await getAllChecklist();
        res.status(200).json({ data: checklists });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener checklists' });
    }
}

export const postChecklistHandler = async (req: Request, res: Response) => {
    try {
        
        // Validación de campo 'nombre'
        if (!req.body.nombre) {
             res.status(400).json({ error: 'El campo nombre es obligatorio' });
             return;
        }

        const newChecklist = await createChecklist(req.body);
        res.status(201).json({ data: newChecklist });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear checklist' });
    }
}

export const putChecklistHandler = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        // Validacion de ID válido
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido' });
            return;
        }

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

export const deleteChecklistHandler = async(req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        // Validacion de ID válido
        if (isNaN(id)) {
            res.status(400).json({ error: 'ID inválido' });
            return;
        }

        const deletedChecklist = await deleteChecklistByID(id);
        if (!deletedChecklist) {
            res.status(404).json({ error: 'Checklist no encontrado' });
            return;
        }   
        res.status(200).json({ data: deletedChecklist });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar checklist' });
    }
}