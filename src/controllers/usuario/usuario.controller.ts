import { Request, Response } from "express";
import { getAllUsuarios,
        getUsuarioById,
        createUsuario,
        updateUsuario,
        deleteUsuario
 } from "../../services/usuario/usuario.service";
import { AuthRequest } from "../../types/types";

//Get Usuarios
export const getUsuariosHandler = async (req: Request, res: Response) => {
    try {
        const usuarios = await getAllUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }   
};

//Get Usuario by ID
export const getUsuarioByIdHandler = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
        const usuario = await getUsuarioById(id);
        if (!usuario) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

//Post Usuario
export const createUsuarioHandler = async (req: AuthRequest, res: Response) => {
    try {
        const newUsuario = await createUsuario(req.body);
        res.status(201).json(newUsuario);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

//Patch Usuario
export const updateUsuarioHandler = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: 'No se enviaron datos para actualizar' });
        return;
    }
    try {
        const updatedUsuario = await updateUsuario(id, req.body);
        if (!updatedUsuario) {
            res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
            return;
        }
        res.status(200).json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }   
};

//Delete Usuario
export const deleteUsuarioHandler = async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id, 10);
    try {
        const deleted = await deleteUsuario(id);
        if (!deleted) {
            res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
            return;
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
