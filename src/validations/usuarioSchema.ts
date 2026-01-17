import { z } from 'zod';
import { positiveIntId, positiveIntIdCoercion } from './globalTypeSchema';

const tipoUsuarioEnum = z.enum(['SUPERVISOR', 'COORDINADOR', 'DIRECTOR']);

export const createUserSchema = z.object({
    nombre: z.string().min(1).max(100),
    correo: z.string().min(1).email().max(150).endsWith('ucab.edu.ve'),
    tipo: tipoUsuarioEnum,
    contraseña: z.string().min(1, 'La contraseña es obligatoria').min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const urlParamsSchema = z.object({
    id: positiveIntIdCoercion,
});

export const updateUserSchema = createUserSchema.partial()
