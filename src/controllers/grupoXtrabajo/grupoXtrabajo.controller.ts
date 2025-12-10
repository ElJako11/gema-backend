import { Request, Response } from 'express';
import {
    asignarGrupo,
    desasignarGrupo, 
    getGruposAsignadosATrabajo
} from '../../services/grupoXtrabajo/grupoXtrabajo.service';
import { AuthRequest } from '../../types/types';

/**
 * 1. ASIGNAR (POST)
 * Ruta esperada: POST /trabajos/:id/grupos
 * Body esperado: { "idG": 5 }
 */
export const assignGrupoHandler = async (req: AuthRequest, res: Response) => {
    // 1. Obtenemos el ID del trabajo desde la URL
    const idT = parseInt(req.params.id, 10);
    
    // 2. Obtenemos el ID del grupo desde el Body (validado previamente por Zod)
    const { idG } = req.body;

    if (isNaN(idT)) {
        return res.status(400).json({ message: 'ID de trabajo inválido' });
    }

    try {
        // Llamamos al servicio
        const nuevaAsignacion = await asignarGrupo({ idT, idG });

        // 201 Created: Se creó el vínculo
        return res.status(201).json({
            message: 'Grupo asignado al trabajo correctamente',
            data: nuevaAsignacion
        });

    } catch (error) {
        // Tip: Aquí podrías chequear si es error de llave foránea o duplicado
        console.error(error);
        return res.status(500).json({ message: 'No se pudo asignar el grupo. Verifique que ambos IDs existan.' });
    }
};

/**
 * 2. OBTENER (GET)
 * Ruta esperada: GET /trabajos/:id/grupos
 * Devuelve: Objeto con nombre del trabajo y lista de grupos
 */
export const getGruposByTrabajoHandler = async (req: Request, res: Response) => {
    const idT = parseInt(req.params.id, 10);

    if (isNaN(idT)) {
        return res.status(400).json({ message: 'ID de trabajo inválido' });
    }

    try {
        const rawResult = await getGruposAsignadosATrabajo(idT);

        // Si no hay resultados, devolvemos un array vacío o un mensaje 404,
        // pero en este caso, devolvemos un objeto estructurado vacío.
        if (!rawResult || rawResult.length === 0) {
            return res.status(200).json({ 
                trabajo: null, 
                grupos: [],
                message: "No hay grupos asignados a este trabajo" 
            });
        }

        // TRANSFORMACIÓN DE DATOS
        // Convertimos la lista plana de SQL a un objeto JSON anidado y limpio
        const response = {
            trabajo: rawResult[0].nombreTrabajo, // Tomamos el nombre del primero
            idTrabajo: idT,
            grupos: rawResult.map(item => ({
                id: item.idG,
                nombre: item.nombre
            }))
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los grupos del trabajo' });
    }
};

/**
 * 3. DESVINCULAR (DELETE)
 * Ruta esperada: DELETE /trabajos/:idT/grupos/:idG
 * Nota: Aquí recibimos AMBOS IDs por la URL
 */
export const deleteGrupoHandler = async (req: AuthRequest, res: Response) => {
    const idT = parseInt(req.params.idT, 10);
    const idG = parseInt(req.params.idG, 10);

    if (isNaN(idT) || isNaN(idG)) {
        return res.status(400).json({ message: 'IDs inválidos proporcionados' });
    }

    try {
        const deleted = await desasignarGrupo(idT, idG);

        if (!deleted) {
            return res.status(404).json({ message: 'No se encontró esa asignación para eliminar' });
        }

        // 200 OK con mensaje (o podrías usar 204 sin contenido)
        return res.status(200).json({ message: 'Grupo desvinculado correctamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al desvincular el grupo' });
    }
};