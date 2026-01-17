import { Request, Response } from 'express';
import {
    checkAndCreatePeriodicMaintenance,
    checkAndCreatePeriodicInspection,
} from '../../services/cron/cron.service';

export const executeMantenimientosHandler = async (req: Request, res: Response) => {
    try {
        console.log('Disparador Manual: Mantenimientos');
        await checkAndCreatePeriodicMaintenance();
        res.status(200).json({ message: 'Verificación de mantenimientos ejecutada.' });
    } catch (error) {
        res.status(500).json({ message: 'Error ejecutando mantenimientos', error: error instanceof Error ? error.message : error });
    }
};

export const executeInspeccionesHandler = async (req: Request, res: Response) => {
    try {
        console.log('Disparador Manual: Inspecciones');
        await checkAndCreatePeriodicInspection();
        res.status(200).json({ message: 'Verificación de inspecciones ejecutada.' });
    } catch (error) {
        res.status(500).json({ message: 'Error ejecutando inspecciones', error: error instanceof Error ? error.message : error });
    }
};