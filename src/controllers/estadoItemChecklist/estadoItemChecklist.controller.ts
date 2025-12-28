import { Request, Response } from 'express';
import {
    createEstadoItemChecklist,
    patchEstadoItemChecklist,
    getEstadoItemChecklist,
    deleteEstadoItemChecklist
} from '../../services/estadoItemChecklist/estadoItemChecklist.service';

// POST
export const postEstadoItemHandler = async (req: Request, res: Response) => {
    try {
        const result = await createEstadoItemChecklist(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// PATCH (Con IDs en la URL)
export const patchEstadoItemHandler = async (req: Request, res: Response) => {
    // 1. Extraer Params
    const { idTrabajo, idChecklist, idItemChecklist } = req.params;
    // 2. Extraer Body
    const { estado } = req.body;

    try {
        // Convertimos params a números
        const keys = {
            idTrabajo: Number(idTrabajo),
            idChecklist: Number(idChecklist),
            idItemChecklist: Number(idItemChecklist)
        };

        const result = await patchEstadoItemChecklist(keys, estado);

        if (!result) {
            res.status(404).json({ error: 'No se encontró el item o no hubo cambios' });
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error interno al actualizar' });
    }
};

// GET (Con IDs en la URL también, para mantener consistencia)
export const getEstadoItemHandler = async (req: Request, res: Response) => {
    const { idTrabajo, idChecklist, idItemChecklist } = req.params;

    try {
        const keys = {
            idTrabajo: Number(idTrabajo),
            idChecklist: Number(idChecklist),
            idItemChecklist: Number(idItemChecklist)
        };

        const result = await getEstadoItemChecklist(keys);

        if (!result) {
            res.status(404).json({ error: 'Estado no encontrado' });
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

// DELETE
export const deleteEstadoItemHandler = async (req: Request, res: Response) => {
    const { idTrabajo, idChecklist, idItemChecklist } = req.params;

    try {
        const keys = {
            idTrabajo: Number(idTrabajo),
            idChecklist: Number(idChecklist),
            idItemChecklist: Number(idItemChecklist)
        };

        const result = await deleteEstadoItemChecklist(keys);

        if (!result) {
            res.status(404).json({ error: 'No se encontró el registro para eliminar' });
            return;
        }

        res.status(200).json({ message: 'Eliminado correctamente', deleted: result });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al eliminar' });
    }
};