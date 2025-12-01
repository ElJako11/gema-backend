import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
<<<<<<< HEAD
import { AuthRequest } from '../types/types';
import { JwtPayload } from 'jsonwebtoken';

export const authenticate = (authorizedRoles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.cookies.accessToken;
=======
import { tokenPayload } from '../types/types';

export interface AuthRequest extends Request {
  user?: tokenPayload | undefined;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string | undefined = req.cookies.accessToken;
>>>>>>> feat/auth

  if (!token) {
    res.status(401).json({ error: 'Token no obtenido. Usuario no autorizado' });
    return;
  }

  // Verifico si el token es valido.
  try {
    const decoded: tokenPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      userId: number;
      tipo: string;
    };

    if (!decoded) {
      res.status(401).json({ error: 'Debe iniciar sesion' });
      return;
    }

    req.user = decoded;
    next();

    return;
  } catch (error) {
    res.status(401).json({ message: 'Inicia Sesión' });
    return;
  }
};
