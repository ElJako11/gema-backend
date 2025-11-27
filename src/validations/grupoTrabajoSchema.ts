import { z } from "zod";

export const grupoTrabajoSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es requerido") // asegura que no esté vacío
    .min(3, "El código debe tener al menos 3 caracteres"),
  nombre: z
    .string()
    .min(1, "El nombre es requerido"), // asegura que no esté vacío
  supervisorId: z.coerce
    .number()
    .int()
    .refine((val) => val !== undefined && val !== null, {
      message: 'El supervisorId es requerido',
    }),
  area: z
    .string()
    .min(1, 'El area es requerida')
    .min(3, 'El area debe tener al menos 3 caracteres'),
});

export type TGrupoTrabajo = z.infer<typeof grupoTrabajoSchema>;
