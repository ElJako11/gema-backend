import { z } from 'zod';

// Enum para el estado
const estadoEnum = z.enum(['COMPLETADA', 'PENDIENTE']);

// Validar lo que viene en la URL (Se usa 'coerce' para transformar string a number)
export const estadoItemParamsSchema = z.object({
  idTrabajo: z.coerce.number().int().positive(),
  idChecklist: z.coerce.number().int().positive(),
  idItemChecklist: z.coerce.number().int().positive(),
});

// Validar lo que viene en el Body (Solo el estado)
export const updateEstadoItemBodySchema = z.object({
  estado: estadoEnum,
});

// Validar lo que viene en el Body para Crear (POST)
export const createEstadoItemSchema = z.object({
  idTrabajo: z.number().int().positive(),
  idChecklist: z.number().int().positive(),
  idItemChecklist: z.number().int().positive(),
  estado: estadoEnum,
});