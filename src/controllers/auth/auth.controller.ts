import { Request, Response, NextFunction } from 'express';
import { login, AuthError,register } from '../../services/auth/auth.service';
import { setCookie } from '../../utils/CookieHandler';

import { setCookie } from '../../utils/cookieHandler';

export const loginHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await login(req.body);
    // Seteo de la cookie.
    setCookie(res, 'accessToken', user.token);

    res.status(201).json({
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
    setCookie(res, 'accessToken', user.token);

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
