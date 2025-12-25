import { db } from '../../config/db';
import { usuarios } from '../../tables/usuarios';
import { CreateTecnicoParams } from '../../types/types';
import { eq } from 'drizzle-orm';

export const createTecnico = async ({
  Nombre,
  Correo,
}: CreateTecnicoParams) => {
  try {
    // Validate input
    if (!Nombre || !Correo) {
      throw new Error('Nombre y Correo son campos obligatorios');
    }

    // Insert into usuarios table
    const insertedUser = await db
      .insert(usuarios)
      .values({
        Nombre,
        Correo,
        Tipo: 'SUPERVISOR',
      })
      .returning({ Id: usuarios.Id });

    if (insertedUser.length === 0) {
      throw new Error('Error al crear el usuario');
    }

    return {
      message: 'Usuario creado correctamente',
      userId: insertedUser[0].Id,
    };
  } catch (error) {
    console.error('Error creating tecnico:', error);
    throw new Error('Error al crear el tecnico');
  }
};

export const getAllTecnicos = async () => {
  const tecnicos = await db
    .select({
      Id: usuarios.Id,
      Nombre: usuarios.Nombre,
      Correo: usuarios.Correo,
    })
    .from(usuarios)
    .where(eq(usuarios.Tipo, 'SUPERVISOR'));

  return tecnicos;
};

export const existeTecnico = async (correo: string) => {
  const tecnico = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.Correo, correo))
    .limit(1);
  return tecnico.length > 0 ? true : false;
};

export const getTecnicoById = async (tecnicoId: number) => {
  const tecnico = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.Id, tecnicoId))
    .limit(1);
  return tecnico.length > 0 ? tecnico[0] : null;
};