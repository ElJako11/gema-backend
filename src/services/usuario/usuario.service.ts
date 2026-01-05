import { eq, asc, and, ne } from 'drizzle-orm'; // <--- IMPORTANTE: Agregados 'and' y 'ne'
import { db } from '../../config/db';
import { usuarios } from '../../tables/usuarios';
import { CreateUserParams } from '../../types/userType';
import { hashPassword } from '../../utils/password';

// Get all usuarios
export const getAllUsuarios = async () => {
    try {
        const allUsuarios = await db.select().from(usuarios);
        return allUsuarios;
    } catch (error) {
        console.error('Error al obtener los Usuarios', error);
        throw new Error('No se pudieron obtener los Usuarios');
    }
}

// Get usuario by ID
export const getUsuarioById = async (id: number) => {
    try {
        const usuarioById = await db.select().from(usuarios).where(eq(usuarios.Id, id));
        return usuarioById[0] || null;
    } catch (error) {
        console.error('Error al obtener el Usuario por ID', error);
        throw new Error('No se pudo obtener el Usuario por ID');
    }
}

// Get Usuario (nombre, correo, tipo)
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
    } catch (error) {
        console.error('Error al obtener credenciales de los Usuarios', error);
        throw new Error('No se pudo obtener credenciales de los Usuarios');
    }
}

// Create new usuario
export const createUsuario = async (userData: CreateUserParams) => {
    try {
        // Validar que el correo no exista ya
        const existeUsuario = await db
            .select()
            .from(usuarios)
            .where(eq(usuarios.Correo, userData.correo));

        if (existeUsuario.length > 0) {
            throw new Error('El correo electrónico ya está registrado en el sistema.');
        }

        // Hashear contraseña
        const hashedPassword = await hashPassword(userData.contraseña);

        // Crear el usuario
        const newUsuario = await db.insert(usuarios)
            .values({
                Nombre: userData.nombre,
                Correo: userData.correo,
                Tipo: userData.tipo,
                Contraseña: hashedPassword
            })
            .returning();
        return newUsuario[0] || null;

    } catch (error) {
        // Permitir que el error de validación suba tal cual
        if (error instanceof Error && error.message.includes('registrado')) {
            throw error;
        }
        console.error('Error al crear el Usuario', error);
        throw new Error('No se pudo crear el Usuario');
    }
}

// Update usuario
export const updateUsuario = async (id: number, userData: Partial<CreateUserParams>) => {
    if (Object.keys(userData).length === 0) {
        return null;
    }

    try {
        // --- NUEVA VALIDACIÓN ---
        // Si se intenta cambiar el correo, verificar que no pertenezca a OTRO usuario
        if (userData.correo) {
            const existeOtro = await db
                .select()
                .from(usuarios)
                .where(
                    and(
                        eq(usuarios.Correo, userData.correo), // Tiene el mismo correo
                        ne(usuarios.Id, id)                   // PERO NO es este mismo usuario
                    )
                );

            if (existeOtro.length > 0) {
                throw new Error('El correo electrónico ya está en uso por otro usuario.');
            }
        }

        if (userData.contraseña) {
            userData.contraseña = await hashPassword(userData.contraseña);
        }

        const updatedUsuario = await db.update(usuarios)
            .set({
                Nombre: userData.nombre,
                Correo: userData.correo,
                Tipo: userData.tipo,
                Contraseña: userData.contraseña,
            })
            .where(eq(usuarios.Id, id))
            .returning();

        return updatedUsuario[0] || null;

    } catch (error) {
        // Permitir que el error de validación suba tal cual
        if (error instanceof Error && error.message.includes('en uso')) {
            throw error;
        }
        console.error(`Error al actualizar el Usuario con ID ${id}`, error);
        throw new Error('No se pudo actualizar el Usuario');
    }
}

// Delete usuario
export const deleteUsuario = async (id: number) => {
    try {
        const deleted = await db.delete(usuarios)
            .where(eq(usuarios.Id, id))
            .returning();

        return deleted[0] || null;
    } catch (error) {
        console.error('Error al eliminar el Usuario', error);
        throw new Error('No se pudo eliminar el Usuario');
    }
}