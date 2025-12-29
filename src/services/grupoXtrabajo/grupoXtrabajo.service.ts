import { db } from '../../config/db';
import { grupoXtrabajo } from '../../tables/grupoXtrabajo';
import { eq, and } from 'drizzle-orm';
import { grupoDeTrabajo } from '../../tables/grupoDeTrabajo';
import { trabajo } from '../../tables/trabajo';
import { CreateGrupoXTrabajoParams } from '../../types/grupoXtrabajo'; 

// POST Asignar grupo a trabajo
export const asignarGrupo = async (params: CreateGrupoXTrabajoParams) => {
    try {
        const result = await db.insert(grupoXtrabajo)
            .values(params)
            .returning()
            .onConflictDoNothing(); // <-- Tip Pro: Evita error si ya existe la relación
        return result[0];
    } catch (error) {
        console.error('Error al asignar grupo al trabajo', error);
        throw new Error(String(error)); 
    }
}

// 2. DELETE: Desasignar
export const desasignarGrupo = async (idT: number, idG: number) => {
    const deleted = await db.delete(grupoXtrabajo)
        .where(
            and(
                eq(grupoXtrabajo.idT, idT),
                eq(grupoXtrabajo.idG, idG)
            )
        )
        .returning();
    
    return deleted[0] || null;
}

// 3. GET: Ver grupos de un trabajo
// (Usando join para traer el NOMBRE del grupo, no solo el ID)
export const getGruposAsignadosATrabajo = async (idTrabajo: number) => {
   try{
        const grupos = await db.select({
            idG: grupoDeTrabajo.id,
            nombre: grupoDeTrabajo.nombre,
            nombreTrabajo: trabajo.nombre
        }).from(grupoDeTrabajo)
        .innerJoin(
            grupoXtrabajo
        , eq(grupoDeTrabajo.id, grupoXtrabajo.idG))
        .innerJoin(
            trabajo
        , eq(trabajo.idTrabajo, grupoXtrabajo.idT))
        .where(eq(grupoXtrabajo.idT, idTrabajo));

        return grupos;
    }catch(error){
        console.error('Error al obtener los grupos del trabajo', error);
        throw new Error('No se pudieron obtener los grupos del trabajo');
    }
}