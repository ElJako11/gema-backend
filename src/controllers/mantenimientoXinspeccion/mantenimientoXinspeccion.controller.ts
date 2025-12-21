import { Request, Response } from "express";
import { createMantenimientoXInspeccionParams } from "../../types/mantenimientoXinspeccion";
import {
    getAllMantenimientosXInspeccion,
    getMantenimientoXInspeccionById,
    getMantXInspResumen,
    createMantenimientoXInspeccion,
    updateMantenimientoXInspeccion,
    deleteMantenimientoXInspeccion
} from "../../services/mantenimientoXinspeccion/mantenimientoXinspeccion.service";
import { AuthRequest } from "../../types/types";

//Get All MantenimientosXInspeccion
export const getMantenimientosXInspeccion = async (req: AuthRequest, res: Response) => {
    try {
        const mantenimientosXInspeccion = await getAllMantenimientosXInspeccion();
        res.status(200).json(mantenimientosXInspeccion);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

//Get MantenimientoXInspeccion by ID
export const getMantenimientoXInspeccion = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
        const mantenimientoXInspeccion = await getMantenimientoXInspeccionById(id);
        if (!mantenimientoXInspeccion) {
            res.status(404).json({ message: "MantenimientoXInspeccion no encontrado" });
            return;
        }
        res.status(200).json(mantenimientoXInspeccion);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

//Get MantXInsp Resumen
export const getMantXInspResumenHandler = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
        const mantXInspResumen = await getMantXInspResumen(id);
        if (!mantXInspResumen) {
            res.status(404).json({ message: "MantenimientoXInspeccion para resumen no encontrado" });
            return;
        }
        res.status(200).json(mantXInspResumen);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

//Post MantenimientoXInspeccion
export const createMantenimientoXInspeccionHandler = async (req: AuthRequest, res: Response) => {
    try {
        const newMantenimientoXInspeccion = await createMantenimientoXInspeccion(req.body as createMantenimientoXInspeccionParams);
        res.status(201).json(newMantenimientoXInspeccion);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

//Patch MantenimientoXInspeccion
export const updateMantenimientoXInspeccionHandler = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "No se enviaron datos para actualizar" });
        return;
    }

    try {
        const updatedMantenimientoXInspeccion = await updateMantenimientoXInspeccion(id, req.body);

        if (!updatedMantenimientoXInspeccion) {
            res.status(404).json({ message: "MantenimientoXInspeccion no encontrado para actualizar" });
            return;
        }

        res.status(200).json({ message: "MantenimientoXInspeccion actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

//Delete MantenimientoXInspeccion
export const deleteMantenimientoXInspeccionHandler = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
        const deletedMantenimientoXInspeccion = await deleteMantenimientoXInspeccion(id);
        if (!deletedMantenimientoXInspeccion) {
            res.status(404).json({ message: "MantenimientoXInspeccion no encontrado para eliminar" });
            return;
        }
        res.status(200).json({ message: "MantenimientoXInspeccion eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
        