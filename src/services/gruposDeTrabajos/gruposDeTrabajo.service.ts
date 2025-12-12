import { eq } from 'drizzle-orm';
import { db } from '../../config/db';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';
import { createGrupoDeTrabajoParams } from '../../types/gruposDeTrabajo';

export const createGrupoDeTrabajo = async (
  params: createGrupoDeTrabajoParams
) => {
  const existingGrupo = await db
    .select({ id: grupoDeTrabajo.id })
    .from(grupoDeTrabajo)
    .where(eq(grupoDeTrabajo.codigo, params.codigo))
    .limit(1);

  if (existingGrupo.length > 0) {
    throw new Error('El código del grupo de trabajo ya existe');
  }

  try {
    const inserted = await db
      .insert(grupoDeTrabajo)
      .values({
        codigo: params.codigo,
        nombre: params.nombre,
        area: params.area,
        supervisorId: params.supervisorId,
      })
      .returning();

    if (!inserted.length) {
      throw new Error('Error al crear el grupo de trabajo');
    }

    return {
      message: 'Grupo de trabajo creado correctamente',
      grupo: inserted[0],
    };
  } catch (error) {
    console.error('Error al crear el grupo de trabajo:', error);
    throw error;
  }
};

/**
 * Obtener todos los grupos de trabajo.
 * @author AndresChacon00
 */
export const getGruposDeTrabajo = async () => {
  try {
    const grupos = await db.select().from(grupoDeTrabajo);
    return grupos;
  } catch (error) {
    console.error('Error al obtener los grupos de trabajo', error);
    throw new Error('No se pudieron obtener los grupos de trabajo');
  }
};

/**
 * Obtener un grupo de trabajo por su Id
 * @param id - El id del grupo de trabajo
 * @author AndresChacon00
 */
export const getGrupoDeTrabajoById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(grupoDeTrabajo)
      .where(eq(grupoDeTrabajo.id, id))
      .limit(1);
    if(result.length === 0) {
      return null;
    }
    return result
  } catch (error) {
    console.error(`Error al obtener el grupo de trabajo con ID ${id}:`, error);
    throw new Error('No se pudo obtener el grupo de trabajo.');
  }
};

/**
 * Actualizar un grupo de trabajo existente.
 * @param id - El id del grupo de trabajo a actualizar
 * @params params - Los datos para actualizar el grupo de trabajo
 * @author AndresChacon00
 */
export const updateGrupoDeTrabajo = async (
  id: number,
  params: Partial<createGrupoDeTrabajoParams>
) => {
  try {
    const updated = await db
      .update(grupoDeTrabajo)
      .set({
        codigo: params.codigo,
        nombre: params.nombre,
        area: params.area,
        supervisorId: params.supervisorId,
      })
      .where(eq(grupoDeTrabajo.id, id))
      .returning();
    if (!updated.length) {
      return null;
    }

    return {
      message: 'Grupo de trabajo actualizado correctamente',
      grupo: updated[0],
    };
  } catch (error) {
    console.error(
      `Error al actualizar un grupo de trabajo con ID ${id} :`,
      error
    );
    throw new Error('Error al actualizar el grupo de trabajo');
  }
};

/**
 * Eliminar un grupo de trabajo por su id
 * @param id - El id del grupo de trabajo a eliminar
 * @author AndresChacon00
 */
export const deleteGrupoDeTrabajo = async (id: number) => {
  try {
    const deleted = await db
      .delete(grupoDeTrabajo)
      .where(eq(grupoDeTrabajo.id, id))
      .returning();

    if (!deleted.length) {
      return null;
    }

    return {
      message: 'Grupo de trabajo eliminado correctamente',
      grupo: deleted[0],
    };
  } catch (error) {
    console.error(`Error eliminando grupo de trabajo con ID ${id}: `, error);
    throw new Error('Error al eliminar el grupo de trabajo');
  }
};
