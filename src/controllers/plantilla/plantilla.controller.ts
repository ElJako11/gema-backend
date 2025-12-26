import { Request, Response } from "express";
import { getAllPlantillas, createPlantilla, updatePlantilla, deletePlantillaByID, getPlantillaWithItems } from "../../services/plantilla/plantilla.service";

export const getPlantillaWithItemsHandler = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const plantillaWithItems = await getPlantillaWithItems(id);
        res.status(200).json(plantillaWithItems);
        return;
    } catch (error: any) {
        if (error.message === 'La plantilla no existe') {
            res.status(404).json({ error: 'La plantilla no existe' });
            return;
        }
        res.status(500).json({ error: 'Error al obtener plantilla con items' });
        return;
    }
}    

export const getPlantillaHandler = async (req: Request, res: Response) => {
    try {
        const plantillas = await getAllPlantillas();
        res.status(200).json(plantillas);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener plantillas' });
        return;
    }
}

export const postPlantillaHandler = async (req: Request, res: Response) => {
    try {
        const newPlantilla = await createPlantilla(req.body);
        res.status(201).json(newPlantilla);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error al crear plantilla' });
        return;
    }
}

export const putPlantillaHandler = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const updatedPlantilla = await updatePlantilla(id, req.body);
        if (!updatedPlantilla) {
            res.status(404).json({ error: 'Plantilla no encontrada' });
            return;
        }
        res.status(200).json(updatedPlantilla);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar plantilla' });
        return;
    }
}

export const deletePlantillaHandler = async(req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);

        const deletedPlantilla = await deletePlantillaByID(id);
        if (!deletedPlantilla) {
            res.status(404).json({ error: 'Plantilla no encontrada' });
            return;
        }   
        res.status(200).json({ message: 'Plantilla eliminada correctamente' });
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar plantilla' });
        return;
    }
}
