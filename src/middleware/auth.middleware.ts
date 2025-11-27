import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types/types';
import { JwtPayload } from 'jsonwebtoken';

export const authenticate = (authorizedRoles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.cookies.accessToken;

    if (!token) {
      res
        .status(401)
        .json({ error: 'Token no obtenido. Usuario no autorizado' });
      return;
    }

    // Verifico si el token es valido.
    try {
      const decoded: JwtPayload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as {
        userId: number;
        tipo: string;
      };

      req.user = decoded;

      if (authorizedRoles.length === 0) {
        next();
        return;
      }

      const role: string | undefined = authorizedRoles.find(
        role => role === decoded.tipo
      );

      if (role === undefined) {
        res.status(401).json({ error: 'Usuario no autorizado' });
        return;
      }
      next();
      return;
    } catch (error) {
      res.status(401).json({ message: 'Inicia Sesión' });
      return;
    }
  };
};
