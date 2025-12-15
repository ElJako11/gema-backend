import { z } from 'zod';
import { positiveIntId, positiveIntIdCoercion } from './globalTypeSchema';

export const createTrabajaEnGrupoSchema = z.object({
  tecnicoId: positiveIntId,
  grupoDeTrabajoId: positiveIntId,
});

export const paramsTrabajaEnGrupoSchema = z.object({
  grupoDeTrabajoId: positiveIntIdCoercion,
});

export const deleteTrabajaEnGrupoSchema = z.object({
  tecnicoId: positiveIntIdCoercion,
  grupoDeTrabajoId: positiveIntIdCoercion,
});

export type TCreateTrabajaEnGrupo = z.infer<typeof createTrabajaEnGrupoSchema>;
