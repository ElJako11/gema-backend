import { z } from 'zod';

export const positiveIntId = z
  .number({ error: 'El ID debe ser un número' })
  .int('El ID debe ser un número entero')
  .min(1, 'El ID debe ser un número positivo (mayor que 0)');

export const positiveIntIdCoercion = z.coerce.number().pipe(positiveIntId);

export const QuerySchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  filter: z.string().min(1, 'El filtro es requerido'),
});
