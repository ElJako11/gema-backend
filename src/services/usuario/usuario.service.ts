import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { usuarios } from '../../tables/usuarios';
import { CreateUserParams } from '../../types/userType';

//Get all usuarios
export const getAllUsuarios = async () => {
    try {
        const allUsuarios = await db.select().from(usuarios);
        return allUsuarios;
    }catch (error) {
        console.error('Error al obtener los Usuarios', error);
        throw new Error('No se pudieron obtener los Usuarios');
    }
}

//Get usuario by ID
export const getUsuarioById = async (id: number) => {
    try {
        const usuarioById = await db.select().from(usuarios).where(eq(usuarios.Id, id));
        return usuarioById[0] || null;
    }catch (error) {
        console.error('Error al obtener el Usuario por ID', error);
        throw new Error('No se pudo obtener el Usuario por ID');
    }
}

//Create new usuario
export const createUsuario = async (userData: CreateUserParams) => {
    try {
        const newUsuario = await db.insert(usuarios)
        .values(userData)
        .returning();
        return newUsuario[0] || null;
    }catch (error) {
        console.error('Error al crear el Usuario', error);
        throw new Error('No se pudo crear el Usuario');
    }   
}

//Update usuario
export const updateUsuario = async (id: number, userData: Partial<CreateUserParams>) => {
    if (Object.keys(userData).length === 0) {
        return null; // No hay campos para actualizar
    }

    try {
        const updatedUsuario = await db.update(usuarios)
        .set(userData)
        .where(eq(usuarios.Id, id))
        .returning();
        
        return updatedUsuario[0] || null;
    }catch (error) {
        console.error(`Error al actualizar el Usuario con ID ${id}`, error);
        throw new Error('No se pudo actualizar el Usuario');
    }
}

//Delete usuario
export const deleteUsuario = async (id: number) => {
    try {   
       const deleted = await db.delete(usuarios)
        .where(eq(usuarios.Id, id))
        .returning();

        return deleted[0] || null;
    }catch (error) {
        console.error('Error al eliminar el Usuario', error);
        throw new Error('No se pudo eliminar el Usuario');
    }   
}
