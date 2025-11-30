import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const autorizationMiddleware = (authorizedRoles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userdata = req.user;

    if (userdata === undefined) {
      res.status(400).json({ error: 'No se pudo obtener la data del usuario' });
      return;
    }

    const role: string | undefined = authorizedRoles.find(
      role => role === userdata.tipo
    );

    if (role === undefined) {
      res.status(403).json({ error: 'Usuario no autorizado' });
      return;
    }

    next();
    return;
  };
};
