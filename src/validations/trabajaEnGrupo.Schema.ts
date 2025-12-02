import { z } from 'zod';


const positiveIntId = z
  .number({ error: 'El ID debe ser un número' })
  .int('El ID debe ser un número entero')
  .min(1, 'El ID debe ser un número positivo (mayor que 0)');



export const createTrabajaEnGrupoSchema = z.object({
  tecnicoId: positiveIntId,
  grupoDeTrabajoId: positiveIntId,
});



const positiveIntIdCoercion = z.coerce
    .number()
    .pipe(positiveIntId); 

export const paramsTrabajaEnGrupoSchema = z.object({
  grupoDeTrabajoId: positiveIntIdCoercion,
});

export const deleteTrabajaEnGrupoSchema = z.object({
    tecnicoId: positiveIntIdCoercion,
    grupoDeTrabajoId: positiveIntIdCoercion,
});


export type TCreateTrabajaEnGrupo = z.infer<typeof createTrabajaEnGrupoSchema>;