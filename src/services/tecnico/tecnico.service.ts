import { db } from '../../config/db';
import { eq, and, ne } from 'drizzle-orm';
import { CreateTecnicoParams } from '../../types/tecnico';
import { tecnico } from '../../tables/tecnico';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';

// Get all tecnicos
export const getAllTecnicos = async () => {
  try {
    const tecnicosList = await db.select().from(tecnico);
    return tecnicosList;
  } catch (error) {
    console.error('Error al obtener tecnicos:', error);
    throw new Error('Error al obtener los tecnicos');
  }
};

// Get Tecnico by ID
export const getTecnicoById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(tecnico)
      .where(eq(tecnico.idTecnico, id));

    return result[0] || null;
  } catch (error) {
    console.error('Error al obtener el tecnico por ID:', error);
    throw new Error('Error al obtener el tecnico por ID');
  }
};

// Get lista de tecnicos
export const getListaTecnicos = async () => {
  try {
    const listaTecnicos = await db
      .select({
        idTecnico: tecnico.idTecnico,
        idGrupo: tecnico.idGT,
        nombre: tecnico.nombre,
        correo: tecnico.correo,
        area: grupoDeTrabajo.area,
      })
      .from(tecnico)
      .innerJoin(grupoDeTrabajo, eq(tecnico.idGT, grupoDeTrabajo.id));

    return listaTecnicos;
  } catch (error) {
    console.error('Error al obtener la lista de tecnicos:', error);
    throw new Error('Error al obtener la lista de tecnicos');
  }
};

// Create tecnico
export const createTecnico = async (params: CreateTecnicoParams) => {
  try {
    // --- NUEVA VALIDACIÓN ---
    // Verificar que no exista otro técnico con el mismo correo
    const existeTecnico = await db
      .select()
      .from(tecnico)
      .where(eq(tecnico.correo, params.correo));

    if (existeTecnico.length > 0) {
      throw new Error('Ya existe un técnico registrado con este correo.');
    }

    const insertedTecnico = await db.insert(tecnico).values(params).returning();
    return insertedTecnico[0] || null;
  } catch (error) {
    // Permitir que el error de validación suba
    if (error instanceof Error && error.message.includes('registrado')) {
      throw error;
    }
    console.error('Error al crear tecnico:', error);
    throw new Error('Error al crear el tecnico');
  }
};

// Patch tecnico
export const updateTecnico = async (
  id: number,
  params: Partial<CreateTecnicoParams>
) => {
  if (Object.keys(params).length === 0) {
    return null; // No hay campos para actualizar
  }

  try {
    // --- NUEVA VALIDACIÓN ---
    if (params.correo) {
      const existeOtro = await db
        .select()
        .from(tecnico)
        .where(
          and(
            eq(tecnico.correo, params.correo),
            ne(tecnico.idTecnico, id) // No es este mismo técnico
          )
        );

      if (existeOtro.length > 0) {
        throw new Error('El correo ya está siendo usado por otro técnico.');
      }
    }

    const updatedTecnico = await db
      .update(tecnico)
      .set(params)
      .where(eq(tecnico.idTecnico, id))
      .returning();
    return updatedTecnico[0] || null;
  } catch (error) {
    // Permitir que el error de validación suba
    if (
      error instanceof Error &&
      (error.message.includes('usado') || error.message.includes('técnico'))
    ) {
      throw error;
    }
    console.error('Error al actualizar tecnico:', error);
    throw new Error('Error al actualizar el tecnico');
  }
};

// Delete tecnico
export const deleteTecnico = async (id: number) => {
  try {
    const deleted = await db
      .delete(tecnico)
      .where(eq(tecnico.idTecnico, id))
      .returning();

    return deleted[0] || null;
  } catch (error) {
    console.error('Error al eliminar tecnico:', error);
    throw new Error('Error al eliminar el tecnico');
  }
};
