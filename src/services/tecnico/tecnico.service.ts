import { db } from '../../config/db';
import { eq } from 'drizzle-orm';
import { CreateTecnicoParams } from '../../types/tecnico';
import { tecnico } from '../../tables/tecnico';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';

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

//Get lista de tecnicos 
export const getListaTecnicos = async () => {
  try {
    const listaTecnicos = await db
      .select({
        idTecnico: tecnico.idTecnico,
        nombre: tecnico.nombre,
        correo: tecnico.correo,
        area: grupoDeTrabajo.area
      })
      .from(tecnico)
      .innerJoin(grupoDeTrabajo, eq(tecnico.idGT, grupoDeTrabajo.id));

    return listaTecnicos;
  } catch (error) {
    console.error('Error al obtener la lista de tecnicos:', error);
    throw new Error('Error al obtener la lista de tecnicos');
  }
};

//Create tecnico
export const createTecnico = async (params: CreateTecnicoParams) => {
  try {
    const insertedTecnico = await db
      .insert(tecnico)
      .values(params)
      .returning();
    return insertedTecnico[0] || null;
  } catch (error) {
    console.error('Error al crear tecnico:', error);
    console.error('Error al crear tecnico:', error);
    throw new Error('Error al crear el tecnico');
  }
}

//Paych tecnico
export const updateTecnico = async (id : number, params : Partial<CreateTecnicoParams>) => {
  if (Object.keys(params).length === 0) {
    return null; // No hay campos para actualizar
  }

  try {
    const updatedTecnico = await db
      .update(tecnico)
      .set(params)
      .where(eq(tecnico.idTecnico, id))
      .returning();
    return updatedTecnico[0] || null;
  } catch (error) {
    console.error('Error al actualizar tecnico:', error);
    throw new Error('Error al actualizar el tecnico');
  }
}

//Delete tecnico
export const deleteTecnico = async (id : number) => {
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
}
