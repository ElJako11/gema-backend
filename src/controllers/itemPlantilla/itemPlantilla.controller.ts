import { Request, Response } from "express";
import { createItem, updateItem, deleteItem } from "../../services/itemPlantilla/itemPlantilla.service";

export const postItemHandler = async (req: Request, res: Response) => {
    try {
        const newItem = await createItem(req.body);
        res.status(201).json(newItem);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error al crear item de plantilla' });
        return;
    }
}

export const putItemHandler = async (req: Request, res: Response) => {
    try {
        const idPlantilla = parseInt(req.params.idPlantilla, 10);
        const idItemPlantilla = parseInt(req.params.idItemPlantilla, 10);

        const updatedItem = await updateItem(idItemPlantilla, idPlantilla, req.body);

        if (!updatedItem) {
            res.status(404).json({ error: 'Item de plantilla no encontrado' });
            return;
        }
        
        res.status(200).json(updatedItem);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar item de plantilla' });
        return;
    }
}

export const deleteItemHandler = async (req: Request, res: Response) => {
    try {
        const idPlantilla = parseInt(req.params.idPlantilla, 10);
        const idItemPlantilla = parseInt(req.params.idItemPlantilla, 10);

        const deletedItem = await deleteItem(idItemPlantilla, idPlantilla);

        if (!deletedItem) {
            res.status(404).json({ error: 'Item de plantilla no encontrado' });
            return;
        }

        res.status(200).json({ message: 'Item de plantilla eliminado correctamente' });
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar item de plantilla' });
        return;
    }
}
