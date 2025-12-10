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
