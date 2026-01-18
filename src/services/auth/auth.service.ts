import { db } from '../../config/db';
import { usuarios } from '../../tables/usuarios';
import { authParams } from '../../types/types';
import { comparePassword, hashPassword } from '../../utils/password';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { clearCookie } from '../../utils/cookieHandler';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const login = async ({ Correo, Contraseña }: authParams) => {
  try {
    // Validate input
    if (!Correo || !Contraseña) {
      throw new AuthError('Correo y Contraseña son campos obligatorios');
    }

    // Buscar usuario y coordinador relacionados
    const result = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.Correo, Correo));

    if (result.length === 0) {
      throw new AuthError('El usuario no existe');
    }

    const Usuarios = result[0];

    if (!Usuarios?.Contraseña) {
      throw new AuthError('El usuario no tiene contraseña asignada');
    }

    const isPasswordValid = await comparePassword(
      Contraseña,
      Usuarios.Contraseña
    );

    if (!isPasswordValid) {
      throw new AuthError('Contraseña incorrecta');
    }

    // Genera el token
    const token = jwt.sign(
      { userId: Usuarios.Id, tipo: Usuarios?.Tipo },
      process.env.JWT_SECRET!,
      { expiresIn: '15d' }
    );
    // Excluye la contraseña del usuario antes de devolverlo
    const { Contraseña: _, ...usuarioSinContraseña } = Usuarios;
    return { token, usuario: usuarioSinContraseña };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    console.error('Error autenticando usuario:', error);
    throw new Error('Error al autenticar usuario');
  }
};

// ----------------------------------------------------------
// ----------------------- REGISTRO --------------------------
// ----------------------------------------------------------

export const register = async (data: any) => {
  try {
    const { Correo, Contraseña, ...restoCampos } = data;

    // Validaciones básicas
    if (!Correo || !Contraseña) {
      throw new AuthError('Correo y Contraseña son campos obligatorios');
    }

    // Verificar si ya existe un usuario con ese correo
    const existe = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.Correo, Correo));

    if (existe.length > 0) {
      throw new AuthError('Ya existe un usuario con ese correo');
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword(Contraseña);

    // Crear usuario en DB
    const insertResult = await db
      .insert(usuarios)
      .values({
        Correo,
        Contraseña: hashedPassword,
        ...restoCampos, // Nombre, Tipo, etc.
      })
      .returning();

    const nuevoUsuario = insertResult[0];

    // Generar token igual que login
    const token = jwt.sign(
      { userId: nuevoUsuario.Id, tipo: nuevoUsuario?.Tipo },
      process.env.JWT_SECRET!,
      { expiresIn: '15d' }
    );

    // Excluir contraseña antes de devolver
    const { Contraseña: _, ...usuarioSinContraseña } = nuevoUsuario;

    return { token, usuario: usuarioSinContraseña };
  } catch (error) {
    if (error instanceof AuthError) throw error;

    console.error('Error registrando usuario:', error);
    throw new Error('Error al registrar usuario');
  }
};

export const verifyIdentity = async (userID: number) => {
  const result = await db.select().from(usuarios).where(eq(usuarios.Id, userID)).limit(1);

  if(!result) {
    throw new Error('Este usuario no esta registrado');
  }

  return result[0];
}
