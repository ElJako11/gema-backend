import { Request, Response, NextFunction } from 'express';
import { login, AuthError, register, verifyIdentity } from '../../services/auth/auth.service';
import { clearCookie, setCookie } from '../../utils/cookieHandler';
import { AuthRequest } from '../../types/types';

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await login(req.body);

    console.log(req.headers.origin);

    // Seteo de la cookie.
    setCookie(req, res, 'accessToken', user.token);

    res.status(200).json({
      data: user,
    });
    return;
  } catch (error: any) {
    if (error instanceof AuthError) {
      res.status(401).json({
        error: 'Correo o contraseña incorrectos',
      });
      return;
    }
    console.error('Error in loginHandler:', error);
    res.status(500).json({
      error: 'Error al autenticar coordinador',
    });
  }
};

export const registerHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await register(req.body); // { token, usuario }

    // Seteo de la cookie con el token (login automático)
    setCookie(req, res, 'accessToken', user.token);

    res.status(201).json({
      data: user,
    });
    return;
  } catch (error: any) {
    if (error instanceof AuthError) {
      res.status(400).json({
        error: error.message,
      });
      return;
    }
    console.error('Error in registerHandler:', error);
    res.status(500).json({
      error: 'Error al registrar coordinador',
    });
  }
};

export const logoutHandler = (req: Request, res: Response) => {
  if (!req.cookies?.accessToken) {
    res.status(400).json({ message: 'No se pudo obtener la sesion' });
    return;
  }

  clearCookie(req, res, 'accessToken');

  res.status(200).json({ message: 'Logout exitoso' });
  return;
};

export const verifyIdentityHandler = async (req: AuthRequest, res: Response) => {
  const userData = req.user;

  const userID = userData?.userId;

  try {
    const userInfo = await verifyIdentity(userID!);

    res.status(200).json(userInfo);
    return;
  } catch(error) {
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor';
    res.status(500).json(errorMessage);
    return;
  }
}
