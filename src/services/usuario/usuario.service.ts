import { eq, asc } from 'drizzle-orm';
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

//Get Usuario (nombre, correo, tipo)
export const getUsuarioCredentials = async () => {
    try {
        const listaUsuarios = await db.select({
            id: usuarios.Id,
            nombre: usuarios.Nombre,
            correo: usuarios.Correo,
            tipo: usuarios.Tipo
        }).from(usuarios)
        .orderBy(asc(usuarios.Id));

        return listaUsuarios;
    }catch (error) {
        console.error('Error al obtener credenciales de los Usuarios', error);
        throw new Error('No se pudo obtener credenciales de los Usuarios');
    }
}

//Create new usuario
export const createUsuario = async (userData: CreateUserParams) => {
    console.log("2. DATOS LLEGANDO AL SERVICIO:", userData);
    console.log("Nombre:", userData?.Nombre); // Verifica si es minúscula
    console.log("Nombre (Mayus):", userData?.Nombre); // Verifica si es mayúscula
    try {
        const newUsuario = await db.insert(usuarios)
        .values({
            Nombre: userData.Nombre,
            Correo: userData.Correo,
            Tipo: userData.Tipo,      
            Contraseña: userData.Contraseña
        })
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
