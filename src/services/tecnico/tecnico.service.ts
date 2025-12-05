import { db } from '../../config/db';
// import { usuarios } from '../../tables/usuarios';
// import { CreateTecnicoParams } from '../../types/types';
import { eq } from 'drizzle-orm';
import { CreateTecnicoParams } from '../../types/tecnico';
import { tecnico } from '../../tables/tecnico';

//Get all tecnicos
export const getAllTecnicos = async () => {
  try {
    const tecnicosList = await db
      .select()
      .from(tecnico);
    return tecnicosList;
  } catch (error) {
    console.error('Error al obtener tecnicos:', error);
    throw new Error('Error al obtener los tecnicos');
  }
};

//Create tecnico
export const createTecnico = async (params: CreateTecnicoParams) => {
  // Validate input
    if (!params.nombre || !params.direccion) {
      throw new Error('Nombre y Direccion son campos obligatorios');
    }
  try {
    const insertedTecnico = await db
      .insert(tecnico)
      .values(params)
      .returning();
    return insertedTecnico[0];
  } catch (error) {
    console.error('Error al crear tecnico:', error);
    throw new Error('Error al crear el tecnico');
  }
}

//Put tecnico
export const updateTecnico = async (id : number, params : CreateTecnicoParams) => {
  if (isNaN(id)) {
    throw new Error('ID inválido');
  }
  try {
    const updatedTecnico = await db
      .update(tecnico)
      .set(params)
      .where(eq(tecnico.idTecnico, id))
      .returning();
    return updatedTecnico[0];
  } catch (error) {
    console.error('Error al actualizar tecnico:', error);
    throw new Error('Error al actualizar el tecnico');
  }
}

//Delete tecnico
export const deleteTecnico = async (id : number) => {
  if (isNaN(id)) throw new Error('ID inválido');
  try {
    const deleted = await db
      .delete(tecnico)
      .where(eq(tecnico.idTecnico, id))
      .returning();

    return deleted[0];

  } catch (error) {
    console.error('Error al eliminar tecnico:', error);
    throw new Error('Error al eliminar el tecnico');
  }
};

// export const createTecnico = async ({
//   Nombre,
//   Correo,
// }: CreateTecnicoParams) => {
//   try {
//     // Validate input
//     if (!Nombre || !Correo) {
//       throw new Error('Nombre y Correo son campos obligatorios');
//     }

//     // Insert into usuarios table
//     const insertedUser = await db
//       .insert(usuarios)
//       .values({
//         Nombre,
//         Correo,
//         Tipo: 'SUPERVISOR',
//       })
//       .returning({ Id: usuarios.Id });

//     if (insertedUser.length === 0) {
//       throw new Error('Error al crear el usuario');
//     }

//     return {
//       message: 'Usuario creado correctamente',
//       userId: insertedUser[0].Id,
//     };
//   } catch (error) {
//     console.error('Error creating tecnico:', error);
//     throw new Error('Error al crear el tecnico');
//   }
// };

// export const getAllTecnicos = async () => {
//   const tecnicos = await db
//     .select({
//       Id: usuarios.Id,
//       Nombre: usuarios.Nombre,
//       Correo: usuarios.Correo,
//     })
//     .from(usuarios)
//     .where(eq(usuarios.Tipo, 'SUPERVISOR'));

//   return tecnicos;
// };
