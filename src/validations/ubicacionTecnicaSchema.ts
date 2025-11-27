import { z } from "zod";

export const ubicacionTecnicaSchema = z.object({
  descripcion: z
    .string()
    .min(1, "La descripción no puede estar vacía")
    .max(50, "La descripción debe tener como máximo 50 caracteres"),
  abreviacion: z
    .string()
    .min(1, "La abreviación no puede estar vacía")
    .max(5, "La abreviación debe tener como máximo 5 caracteres"),
  padres: z
    .array(
      z.object({
        idPadre: z
          .number()
          .refine((val) => val !== undefined, {
            message: "El idPadre es requerido",
          }),
        esUbicacionFisica: z.boolean().optional(),
      })
    )
    .optional(),
});

export type TUbicacionTecnica = z.infer<typeof ubicacionTecnicaSchema>;
