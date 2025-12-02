import { z } from 'zod';

// Normalize both english keys (email/password) and spanish keys (Correo/Contraseña)
// into the shape expected by the service: { Correo, Contraseña }
export const loginSchema = z.preprocess((raw) => {
  if (typeof raw !== 'object' || raw === null) return raw;
  const obj = raw as any;
  const Correo = obj.Correo ?? obj.email;
  const Contraseña = obj.Contraseña ?? obj.password;
  return { Correo, Contraseña };
}, z.object({
  Correo: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Correo electrónico inválido')
    .endsWith('ucab.edu.ve', 'El correo debe ser de la UCAB'),
  Contraseña: z.string().min(1, 'La contraseña es requerida'),
}));

export type TLogin = z.infer<typeof loginSchema>;
