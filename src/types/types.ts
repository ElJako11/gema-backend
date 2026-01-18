import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

export type UsuarioTipo = 'TECNICO' | 'COORDINADOR'; // Add other allowed values if needed

export type CreateTecnicoParams = {
  Nombre: string;
  Correo: string;
  Tipo: UsuarioTipo;
};

export type CreateCoordinadorParams = {
  Nombre: string;
  Correo: string;
  Tipo: UsuarioTipo;
  Contraseña: string;
};

export type authParams = {
  Correo: string;
  Contraseña: string;
};

export interface AuthRequest extends Request {
  user?: tokenPayload;
}

export type tokenPayload = {
  userId: number;
  tipo: string;
};
