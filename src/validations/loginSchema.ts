import { z } from "zod";

export const loginSchema = z.object(
  {
    email: z
      .string()
      .min(1, "El correo electrónico es requerido") // aquí controlas el requerido
      .email("Correo electrónico inválido")
      .endsWith("ucab.edu.ve", "El correo debe ser de la UCAB"),
    password: z
      .string()
      .min(1, "La contraseña es requerida"), // aquí también
  }
);

export type TLogin = z.infer<typeof loginSchema>;
