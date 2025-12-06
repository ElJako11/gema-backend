import { z } from 'zod';

export const positiveIntId = z
  .number({ error: 'El ID debe ser un número' })
  .int('El ID debe ser un número entero')
  .min(1, 'El ID debe ser un número positivo (mayor que 0)');

export const positiveIntIdCoercion = z.coerce.number().pipe(positiveIntId);
